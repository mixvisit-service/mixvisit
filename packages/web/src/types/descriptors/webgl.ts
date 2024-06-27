import { PRECISION_TYPES, SHADER_TYPES } from '../../utils/constants';
import type { CanvasContext } from '../base';
import type { Nullable } from '../utils';

export type WebGLInfo = {
  webglImageHash: string;
  supportedWebGLContexts: WebGLContextInfo[];
};

export type BasicsParams = {
  contextName: string;
  version: string;
  shadingLanguageVersion: string;
  vendor: string;
  renderer: string;
  unmaskedVendor: string;
  unmaskedRenderer: string;
};

export type ExtendedParams = {
  contextAttributes?: WebGLContextAttributes;
  shaderPrecisions: ShaderPrecisions;
  supportedFunctions?: string[];
  extensions?: string[];
} & Parameters;

export type ContextInfo = {
  context: CanvasContext | null;
  contextName: string;
};

export type ShaderType = (typeof SHADER_TYPES)[number];
export type PrecisionType = (typeof PRECISION_TYPES)[number];

export type ShaderPrecisions = {
  [K in ShaderType]: {
    [P in PrecisionType]: string;
  };
};

type WebGLContextInfo = {
  basics: BasicsParams | null;
  contextAttributes: WebGLContextAttributes | null;
  shaderPrecisions: ShaderPrecisions | null;
  extensions: string[] | null;
  supportedFunctions: string[] | null;
} & Nullable<Parameters>;

type Parameters = {
  vertexShader: VertexShader;
  transformFeedback: TransformFeedback;
  rasterizer: Rasterizer;
  fragmentShader: FragmentShader;
  framebuffer: Framebuffer;
  textures: Textures;
  uniformBuffers: UniformBuffers;
};

type VertexShader = {
  MAX_VERTEX_ATTRIBS: number | string;
  MAX_VERTEX_UNIFORM_VECTORS: number | string;
  MAX_VERTEX_TEXTURE_IMAGE_UNITS: number | string;
  MAX_VARYING_VECTORS: number | string;
  VERTEX_BEST_FLOAT_PRECISION: [number, number, number] | string;
  MAX_VERTEX_UNIFORM_COMPONENTS: number | string;
  MAX_VERTEX_UNIFORM_BLOCKS: number | string;
  MAX_VERTEX_OUTPUT_COMPONENTS: number | string;
  MAX_VARYING_COMPONENTS: number | string;
};

type TransformFeedback = {
  MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: number | string;
  MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: number | string;
  MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: number | string;
};

type Rasterizer = {
  ALIASED_POINT_SIZE_RANGE: [number, number] | string;
  ALIASED_LINE_WIDTH_RANGE: [number, number] | string;
};

type FragmentShader = {
  MAX_FRAGMENT_UNIFORM_VECTORS: number | string;
  MAX_TEXTURE_IMAGE_UNITS: number | string;
  FLOAT_INT_PRECISION: string;
  FRAGMENT_BEST_FLOAT_PRECISION: [number, number, number] | string;
  MAX_FRAGMENT_UNIFORM_COMPONENTS: number | string;
  MAX_FRAGMENT_UNIFORM_BLOCKS: number | string;
  MAX_FRAGMENT_INPUT_COMPONENTS: number | string;
  MIN_PROGRAM_TEXEL_OFFSET: number | string;
  MAX_PROGRAM_TEXEL_OFFSET: number | string;
};

type Framebuffer = {
  MAX_DRAW_BUFFERS: number | string;
  MAX_COLOR_ATTACHMENTS: number | string;
  MAX_SAMPLES: number | string;
  RGBA_BITS: [number, number, number, number] | string;
  DEPTH_STENCIL_BITS: [number, number] | string;
  MAX_RENDERBUFFER_SIZE: number | string;
  MAX_VIEWPORT_DIMS: [number, number] | string;
};

type Textures = {
  MAX_TEXTURE_SIZE: number | string;
  MAX_CUBE_MAP_TEXTURE_SIZE: number | string;
  MAX_COMBINED_TEXTURE_IMAGE_UNITS: number | string;
  MAX_TEXTURE_MAX_ANISOTROPY_EXT: number | string;
  MAX_3D_TEXTURE_SIZE: number | string;
  MAX_ARRAY_TEXTURE_LAYERS: number | string;
  MAX_TEXTURE_LOD_BIAS: number | string;
};

type UniformBuffers = {
  MAX_UNIFORM_BUFFER_BINDINGS: number | string;
  MAX_UNIFORM_BLOCK_SIZE: number | string;
  UNIFORM_BUFFER_OFFSET_ALIGNMENT: number | string;
  MAX_COMBINED_UNIFORM_BLOCKS: number | string;
  MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: number | string;
  MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: number | string;
};
