import { createCanvas } from 'canvas';
import { LegacyRoot } from "react-reconciler/constants";
import { createRenderer } from "./renderer";
import { resolveStyles } from "./style";
import { createYogaNodes, persistDimensions } from "./layout";
import { renderNode } from './render';
export { Canvas, View, Image, Text } from './components';

declare var BROWSER: boolean;

const reconcileRoot = async (element: React.ReactElement) => {
  const root = { type: "ROOT", container: null, children: [] };
  const renderer = createRenderer();

  const mountNode = renderer.createContainer(
    root,
    LegacyRoot,
    null,
    false,
    null,
    "",
    () => {},
    null
  );

  await new Promise<void>((resolve) =>
    renderer.updateContainer(element, mountNode, null, () => resolve())
  );

  root.container.style = {
    width: root.container.props.width || 500,
    height: root.container.props.height || 500,
    backgroundColor: root.container.props.backgroundColor
  }

  return root;
}

const renderToCanvas = async (canvas, root) => {
  let result = resolveStyles(root.container);

  const ctx = canvas.getContext("2d");
  
  result = createYogaNodes(result, ctx);
  result.yogaNode.calculateLayout();

  persistDimensions(result);

  await renderNode(ctx, result);
}

export const renderToBlob = async (element: React.ReactElement) => {
  if (!BROWSER) {
    throw new Error('renderToBlob is not support in nodejs environment')
  }

  const root = await reconcileRoot(element);

  const canvas = new OffscreenCanvas(root.container.style.width, root.container.style.width);

  await renderToCanvas(canvas, root);

  return canvas.convertToBlob();
};


export const renderToBuffer = async (element: React.ReactElement) => {
  if (BROWSER) {
    throw new Error('renderToBuffer is not support in browser environment')
  }

  const root = await reconcileRoot(element);

  const canvas = createCanvas(root.container.style.width, root.container.style.width);

  await renderToCanvas(canvas, root);

  return canvas.toBuffer();
};
