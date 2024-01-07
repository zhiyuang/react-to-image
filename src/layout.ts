import * as Yoga from "@react-pdf/yoga/dist/index";

const ALIGN = {
  "flex-start": Yoga.ALIGN_FLEX_START,
  center: Yoga.ALIGN_CENTER,
  "flex-end": Yoga.ALIGN_FLEX_END,
  stretch: Yoga.ALIGN_STRETCH,
  baseline: Yoga.ALIGN_BASELINE,
  "space-between": Yoga.ALIGN_SPACE_BETWEEN,
  "space-around": Yoga.ALIGN_SPACE_AROUND,
};

const JUSTIFY_CONTENT = {
  center: Yoga.JUSTIFY_CENTER,
  "flex-end": Yoga.JUSTIFY_FLEX_END,
  "space-between": Yoga.JUSTIFY_SPACE_BETWEEN,
  "space-around": Yoga.JUSTIFY_SPACE_AROUND,
  "space-evenly": Yoga.JUSTIFY_SPACE_EVENLY,
};

const FLEX_DIRECTIONS = {
  row: Yoga.FLEX_DIRECTION_ROW,
  "row-reverse": Yoga.FLEX_DIRECTION_ROW_REVERSE,
  "column-reverse": Yoga.FLEX_DIRECTION_COLUMN_REVERSE,
};

const setYogaValues = (node) => {
  if (!node.style) return;

  node.style.width && node.yogaNode.setWidth(node.style.width);
  node.style.height && node.yogaNode.setHeight(node.style.height);
  node.style.marginLeft &&
    node.yogaNode.setMargin(Yoga.EDGE_LEFT, node.style.marginLeft);
  node.style.marginRight &&
    node.yogaNode.setMargin(Yoga.EDGE_RIGHT, node.style.marginRight);
  node.style.marginTop &&
    node.yogaNode.setMargin(Yoga.EDGE_TOP, node.style.marginTop);
  node.style.marginBottom &&
    node.yogaNode.setMargin(Yoga.EDGE_BOTTOM, node.style.marginBottom);
  node.style.paddingLeft &&
    node.yogaNode.setMargin(Yoga.EDGE_LEFT, node.style.paddingLeft);
  node.style.paddingRight &&
    node.yogaNode.setMargin(Yoga.EDGE_RIGHT, node.style.paddingRight);
  node.style.paddingTop &&
    node.yogaNode.setPadding(Yoga.EDGE_TOP, node.style.paddingTop);
  node.style.paddingBottom &&
    node.yogaNode.setPadding(Yoga.EDGE_BOTTOM, node.style.paddingBottom);
  node.style.borderLeftWidth &&
    node.yogaNode.setBorder(Yoga.EDGE_LEFT, node.style.borderLeftWidth);
  node.style.borderRightWidth &&
    node.yogaNode.setBorder(Yoga.EDGE_RIGHT, node.style.borderRightWidth);
  node.style.borderTopWidth &&
    node.yogaNode.setBorder(Yoga.EDGE_TOP, node.style.borderTopWidth);
  node.style.borderBottomWidth &&
    node.yogaNode.setBorder(Yoga.EDGE_BOTTOM, node.style.borderBottomWidth);

  if (node.style.display === "flex") {
    node.yogaNode.setDisplay(Yoga.DISPLAY_FLEX);
  }

  if (node.style.alignItems) {
    node.yogaNode.setAlignItems(ALIGN[node.style.alignItems]);
  }

  if (node.style.justifyContent) {
    node.yogaNode.setJustifyContent(JUSTIFY_CONTENT[node.style.justifyContent]);
  }

  if (node.style.flexDirection) {
    node.yogaNode.setFlexDirection(FLEX_DIRECTIONS[node.style.flexDirection]);
  }
};

const setMeasureFunc = (node, ctx) => {
  const { yogaNode } = node;

  if (node.type === "Text") {
    ctx.save();
    if (node.style.font) {
      ctx.font = node.style.font;
    }
    const result = ctx.measureText(node.children[0].value);
    yogaNode.setMeasureFunc(() => ({ width: result.width, height: 0 }));
    ctx.restore();
  }

  // if (node.type === 'Image') {
  //   yogaNode.setMeasureFunc(() => ({ width: 40, height: 40 }));
  // }
};

export const createYogaNodes = (node, ctx) => {
  const yogaNode = Yoga.Node.create();

  node.yogaNode = yogaNode;

  setYogaValues(node);

  if (node.type !== "Text" && node.children) {
    node.children = node.children.map((node) => {
      const nodeWithYoga = createYogaNodes(node, ctx);
      yogaNode.insertChild(nodeWithYoga.yogaNode, yogaNode.getChildCount());

      return nodeWithYoga;
    });
  }

  setMeasureFunc(node, ctx);

  return node;
};

export const persistDimensions = (node) => {
  if (node.type === "TEXT_INSTANCE") return node;

  const yogaNode = node.yogaNode;

  const box = {
    borderTopWidth: yogaNode.getComputedBorder(Yoga.EDGE_TOP),
    borderRightWidth: yogaNode.getComputedBorder(Yoga.EDGE_RIGHT),
    borderBottomWidth: yogaNode.getComputedBorder(Yoga.EDGE_BOTTOM),
    borderLeftWidth: yogaNode.getComputedBorder(Yoga.EDGE_LEFT),
    top: yogaNode.getComputedTop(),
    right: yogaNode.getComputedRight(),
    bottom: yogaNode.getComputedBottom(),
    left: yogaNode.getComputedLeft(),
    width: yogaNode.getComputedWidth(),
    height: yogaNode.getComputedHeight(),
  };

  node.box = box;

  if (!node.children) return node;

  node.children = node.children.map(persistDimensions);

  return node;
};
