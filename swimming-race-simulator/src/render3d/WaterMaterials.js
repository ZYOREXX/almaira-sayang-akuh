import * as THREE from 'three';

export const MAX_WAKES = 8;

/** Fungsi tinggi gelombang dipakai bersama di vertex & fragment shader. */
const WAVE_GLSL = /* glsl */ `
uniform float uTime;
uniform vec4 uWakes[${MAX_WAKES}]; // x, z, kecepatan, arah (+1/-1, 0 = nonaktif)

float waveHeight(vec2 p) {
  float h = 0.0;
  h += sin(p.x * 0.85 + uTime * 1.25) * 0.016;
  h += sin(p.y * 1.25 - uTime * 1.05 + p.x * 0.31) * 0.013;
  h += sin((p.x + p.y) * 2.6 + uTime * 2.3) * 0.005;
  h += sin((p.x * 0.6 - p.y) * 3.7 - uTime * 2.9) * 0.003;
  for (int i = 0; i < ${MAX_WAKES}; i++) {
    vec4 w = uWakes[i];
    if (abs(w.w) < 0.5) continue;
    vec2 d = p - w.xy;
    float along = d.x * w.w;           // positif = di depan perenang
    float behind = max(-along, 0.0);
    float lateral = abs(d.y);
    // gelombang haluan di sekitar kepala
    float r = length(d);
    h += w.z * 0.035 * exp(-r * r * 2.2) * sin(r * 8.0 - uTime * 10.0);
    // jejak V di belakang perenang
    float v = exp(-pow(lateral - behind * 0.32, 2.0) * 6.0) * exp(-behind * 0.35) * step(0.0, behind);
    h += w.z * 0.03 * v * sin(behind * 5.0 - uTime * 7.0);
  }
  return h;
}
`;

/** Permukaan air: gelombang, Fresnel, pantulan langit-langit stadion, kilau lampu. */
export function createWaterMaterial() {
  const wakes = [];
  for (let i = 0; i < MAX_WAKES; i++) wakes.push(new THREE.Vector4());
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uWakes: { value: wakes },
      uDeep: { value: new THREE.Color('#0a6ea8') },
      uShallow: { value: new THREE.Color('#39c4f0') },
      uSkyLow: { value: new THREE.Color('#8fb4d6') },
      uSkyHigh: { value: new THREE.Color('#1b2c4a') },
      uSunDir: { value: new THREE.Vector3(0.25, 0.9, 0.35).normalize() },
    },
    vertexShader: /* glsl */ `
      ${WAVE_GLSL}
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        w.y += waveHeight(w.xz);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      ${WAVE_GLSL}
      uniform vec3 uDeep, uShallow, uSkyLow, uSkyHigh, uSunDir;
      varying vec3 vWorld;

      void main() {
        vec2 p = vWorld.xz;
        float e = 0.04;
        float h = waveHeight(p);
        float hx = waveHeight(p + vec2(e, 0.0));
        float hz = waveHeight(p + vec2(0.0, e));
        // riak halus untuk kilau
        float fx = sin(p.x * 9.0 + uTime * 3.1) * cos(p.y * 7.0 - uTime * 2.3) * 0.12;
        float fz = cos(p.x * 6.0 - uTime * 2.7) * sin(p.y * 10.0 + uTime * 3.4) * 0.12;
        vec3 N = normalize(vec3(-(hx - h) / e + fx, 1.0, -(hz - h) / e + fz));
        vec3 V = normalize(cameraPosition - vWorld);
        float ndv = max(dot(N, V), 0.0);
        float fres = 0.03 + 0.97 * pow(1.0 - ndv, 5.0);

        vec3 R = reflect(-V, N);
        vec3 sky = mix(uSkyLow, uSkyHigh, smoothstep(0.0, 0.6, R.y));
        // pantulan deretan lampu atap
        float lamps = smoothstep(0.86, 1.0, sin(R.x / max(R.y, 0.15) * 3.0)) * smoothstep(0.2, 0.7, R.y);
        sky += vec3(1.0, 0.97, 0.9) * lamps * 0.9;
        float spec = pow(max(dot(R, uSunDir), 0.0), 260.0) * 3.0;

        vec3 body = mix(uShallow, uDeep, clamp(1.0 - ndv, 0.0, 1.0));
        vec3 col = mix(body, sky, fres * 0.85) + spec;
        float alpha = mix(0.34, 0.93, fres);
        gl_FragColor = vec4(col, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

/** Dasar & dinding kolam: ubin + caustics beranimasi + warna kedalaman. */
export function createPoolFloorMaterial(tileTex, { repeat = 1 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTiles: { value: tileTex },
      uRepeat: { value: repeat },
      uTint: { value: new THREE.Color('#4fb6e3') },
      uDeepTint: { value: new THREE.Color('#0b5f93') },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      varying vec2 vUv;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: /* glsl */ `
      #define TAU 6.28318530718
      uniform float uTime;
      uniform float uRepeat;
      uniform sampler2D uTiles;
      uniform vec3 uTint, uDeepTint;
      varying vec3 vWorld;
      varying vec2 vUv;

      // caustics klasik (iterasi distorsi), tileable
      float caustic(vec2 uv, float t) {
        vec2 p = mod(uv * TAU, TAU) - 250.0;
        vec2 i = p;
        float c = 1.0;
        float inten = 0.005;
        for (int n = 0; n < 4; n++) {
          float tt = t * (1.0 - (3.5 / float(n + 1)));
          i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
          c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
        }
        c /= 4.0;
        c = 1.17 - pow(c, 1.4);
        return pow(abs(c), 8.0);
      }

      void main() {
        vec3 tile = texture2D(uTiles, vUv * uRepeat).rgb;
        float c = caustic(vWorld.xz / 7.0, uTime * 0.45);
        c += caustic(vWorld.xz / 4.3 + 0.37, uTime * 0.37) * 0.6;
        float depth = clamp(-vWorld.y / 2.2, 0.0, 1.0);
        vec3 tint = mix(uTint, uDeepTint, depth * 0.7);
        vec3 col = tile * tint * 0.95 + vec3(0.75, 0.95, 1.0) * c * 0.55 * (1.0 - depth * 0.3);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}
