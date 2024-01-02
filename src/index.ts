import { createCanvas } from 'canvas';
import { LegacyRoot } from "react-reconciler/constants";
import { createRenderer } from "./renderer";
import { resolveStyles } from "./style";
import { createYogaNodes, persistDimensions } from "./layout";
import { renderNode } from './render';

export const renderToStream = async (element) => {
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

  let result: any = resolveStyles(root.container);
  result = createYogaNodes(root.container);
  result.yogaNode.calculateLayout();

  persistDimensions(result);
  // console.log(3333, JSON.stringify(result));

  const canvas = createCanvas(result.style.width, result.style.height);
  const ctx = canvas.getContext("2d");
  await renderNode(ctx, result);

  const buf = canvas.toBuffer();

  return buf;
};
