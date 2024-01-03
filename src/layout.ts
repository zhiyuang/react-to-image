import * as Yoga from '@react-pdf/yoga/dist/index';

const ALIGN = {
  'flex-start': Yoga.ALIGN_FLEX_START,
  center: Yoga.ALIGN_CENTER,
  'flex-end': Yoga.ALIGN_FLEX_END,
  stretch: Yoga.ALIGN_STRETCH,
  baseline: Yoga.ALIGN_BASELINE,
  'space-between': Yoga.ALIGN_SPACE_BETWEEN,
  'space-around': Yoga.ALIGN_SPACE_AROUND,
};

const JUSTIFY_CONTENT = {
  center: Yoga.JUSTIFY_CENTER,
  'flex-end': Yoga.JUSTIFY_FLEX_END,
  'space-between': Yoga.JUSTIFY_SPACE_BETWEEN,
  'space-around': Yoga.JUSTIFY_SPACE_AROUND,
  'space-evenly': Yoga.JUSTIFY_SPACE_EVENLY,
};

const FLEX_DIRECTIONS = {
  row: Yoga.FLEX_DIRECTION_ROW,
  'row-reverse': Yoga.FLEX_DIRECTION_ROW_REVERSE,
  'column-reverse': Yoga.FLEX_DIRECTION_COLUMN_REVERSE,
};

const setYogaValues = (node) => {
  if (!node.style) return;
  // console.log(222222, node.style.marginLeft, node.style.marginRight, node.style.marginTop, node.style.marginBottom)
  node.style.width && node.yogaNode.setWidth(node.style.width);
  node.style.height && node.yogaNode.setHeight(node.style.height);
  node.style.marginLeft && node.yogaNode.setMargin(Yoga.EDGE_LEFT, node.style.marginLeft);
  node.style.marginRight && node.yogaNode.setMargin(Yoga.EDGE_RIGHT, node.style.marginRight);
  node.style.marginTop && node.yogaNode.setMargin(Yoga.EDGE_TOP, node.style.marginTop);
  node.style.marginBottom && node.yogaNode.setMargin(Yoga.EDGE_BOTTOM, node.style.marginBottom);
  node.style.paddingLeft && node.yogaNode.setMargin(Yoga.EDGE_LEFT, node.style.paddingLeft);
  node.style.paddingRight && node.yogaNode.setMargin(Yoga.EDGE_RIGHT, node.style.paddingRight);

  if (node.style.display === 'flex') {
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

export const createYogaNodes = (node) => {
  const yogaNode = Yoga.Node.create();

  node.yogaNode = yogaNode;

  setYogaValues(node);

  if (node.type !== 'Text' && node.children) {
    node.children = node.children.map(node => {
      const nodeWithYoga = createYogaNodes(node);
      yogaNode.insertChild(nodeWithYoga.yogaNode, yogaNode.getChildCount());

      return nodeWithYoga;
    });
  }

  return node;
}

export const persistDimensions = (node) => {
  if (node.type === 'TEXT_INSTANCE') return node;

  const yogaNode = node.yogaNode;

  const box = {
    marginLeft: yogaNode.getComputedMargin(Yoga.EDGE_LEFT),
    marginRight: yogaNode.getComputedMargin(Yoga.EDGE_RIGHT),
    top: yogaNode.getComputedTop(),
    right: yogaNode.getComputedRight(),
    bottom: yogaNode.getComputedBottom(),
    left: yogaNode.getComputedLeft(),
    width: yogaNode.getComputedWidth(),
    height: yogaNode.getComputedHeight()
  };

  node.box = box;

  if (!node.children) return node;

  node.children = node.children.map(persistDimensions);

  return node;
}
