/* eslint-disable no-tabs */

import type { CanvasContext } from '../../types/index';
import { x64, bufToHex } from '../../utils/hashing';

const vertextShaderSource = `
	precision mediump float;
	attribute vec2 vertPosition;
	attribute vec3 vertColor;
	varying vec3 fragColor;
	void main() {
	  fragColor = vertColor;
	  gl_Position = vec4(vertPosition, 0.0, 1.0);
	}
`;

const fragmentShaderSource = `
	precision mediump float;
	varying vec3 fragColor;
	void main() {
		gl_FragColor = vec4(fragColor, 1.0);
	}
`;

export function createCanvasImage(ctx: CanvasContext): void {
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

  // Create shaders
  const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
  const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

  ctx.shaderSource(vertexShader, vertextShaderSource);
  ctx.shaderSource(fragmentShader, fragmentShaderSource);

  ctx.compileShader(vertexShader);
  if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', ctx.getShaderInfoLog(vertexShader));

    return;
  }

  ctx.compileShader(fragmentShader);
  if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', ctx.getShaderInfoLog(fragmentShader));

    return;
  }

  const program = ctx.createProgram();
  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);
  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    console.error('ERROR linking program!', ctx.getProgramInfoLog(program));

    return;
  }

  ctx.validateProgram(program);
  if (!ctx.getProgramParameter(program, ctx.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', ctx.getProgramInfoLog(program));

    return;
  }

  // Create buffer
  const triangleVertices = [
    // X, Y,   R, G, B
    0.0, 0.5, 1.0, 1.0, 0.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5, 0.1, 1.0, 0.6,
  ];

  const triangleVertexBufferObject = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, triangleVertexBufferObject);
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(triangleVertices), ctx.STATIC_DRAW);

  const positionAttribLocation = ctx.getAttribLocation(program, 'vertPosition');
  const colorAttribLocation = ctx.getAttribLocation(program, 'vertColor');

  ctx.vertexAttribPointer(positionAttribLocation, 2, ctx.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
  ctx.vertexAttribPointer(colorAttribLocation, 3, ctx.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  ctx.enableVertexAttribArray(positionAttribLocation);
  ctx.enableVertexAttribArray(colorAttribLocation);

  // Main render loop
  ctx.useProgram(program);
  ctx.drawArrays(ctx.TRIANGLES, 0, 3);
}

export function getCanvasImageHash(canvas: HTMLCanvasElement, ctx: CanvasContext): string {
  const { width, height } = canvas;
  const pixels = new Uint8Array(width * height * 4);

  ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, pixels);
  const pixelString = bufToHex(pixels);

  return x64.hash128(pixelString);
}
