import { loadImage, CanvasRenderingContext2D } from 'canvas';
import renderBorders from './renderBorders';

export const renderNode = async (ctx: CanvasRenderingContext2D, node) => {
  ctx.save();
  const hasBackground = !!node.box && !!node.style.backgroundColor;

  if (hasBackground) {
    ctx.save();
    clipNode(ctx, node);
    const { top, left, width, height } = node.box;
    ctx.fillStyle = node.style.backgroundColor;
    ctx.fillRect(left, top, width, height);
    ctx.restore();
  }

  renderBorders(ctx, node);

  if (node.type === 'Image') {
    ctx.save();
    const image = await loadImage(node.props.src);
    const { top, left, width, height } = node.box;
    ctx.drawImage(image, left, top, width, height);
    ctx.restore();
  } else if (node.type === 'Text') {
    ctx.save();

    for (const child of node.children) {
      ctx.textBaseline = 'middle';
      if (node.style.font)
        ctx.font = node.style.font;
      if (node.style.color)
        ctx.fillStyle = node.style.color;
      ctx.fillText(child.value, node.box.left, node.box.top);
    }

    ctx.restore();
  }

  if (node.children) await renderChildren(ctx, node);

  ctx.restore();
}

const renderChildren = async (ctx: CanvasRenderingContext2D, node) => {
  ctx.save();

  if (node.box) {
    ctx.translate(node.box.left, node.box.top);
  }

  for (const child of node.children) {
    await renderNode(ctx, child)
  }

  ctx.restore();
}

// This constant is used to approximate a symmetrical arc using a cubic
// Bezier curve.
const KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);

const clipNode = (ctx: CanvasRenderingContext2D, node) => {
  if (!node.style) return;

  const { top, left, width, height } = node.box;

  const {
    borderTopLeftRadius = 0,
    borderTopRightRadius = 0,
    borderBottomRightRadius = 0,
    borderBottomLeftRadius = 0,
  } = node.style;

  // Border top
  const rtr = Math.min(borderTopRightRadius, 0.5 * width, 0.5 * height);
  const ctr = rtr * (1.0 - KAPPA);

  ctx.beginPath();
  ctx.moveTo(left + rtr, top);
  ctx.lineTo(left + width - rtr, top);
  ctx.bezierCurveTo(
    left + width - ctr,
    top,
    left + width,
    top + ctr,
    left + width,
    top + rtr,
  );

  // Border right
  const rbr = Math.min(borderBottomRightRadius, 0.5 * width, 0.5 * height);
  const cbr = rbr * (1.0 - KAPPA);

  ctx.lineTo(left + width, top + height - rbr);
  ctx.bezierCurveTo(
    left + width,
    top + height - cbr,
    left + width - cbr,
    top + height,
    left + width - rbr,
    top + height,
  );

  // Border bottom
  const rbl = Math.min(borderBottomLeftRadius, 0.5 * width, 0.5 * height);
  const cbl = rbl * (1.0 - KAPPA);

  ctx.lineTo(left + rbl, top + height);
  ctx.bezierCurveTo(
    left + cbl,
    top + height,
    left,
    top + height - cbl,
    left,
    top + height - rbl,
  );

  // Border left
  const rtl = Math.min(borderTopLeftRadius, 0.5 * width, 0.5 * height);
  const ctl = rtl * (1.0 - KAPPA);

  ctx.lineTo(left, top + rtl);
  ctx.bezierCurveTo(left, top + ctl, left + ctl, top, left + rtl, top);
  ctx.closePath();
  ctx.clip();
};
