import ReactFiberReconciler, { HostConfig } from "react-reconciler";
import { DefaultEventPriority } from 'react-reconciler/constants';

const propsEqual = (a, b) => {
  const oldPropsKeys = Object.keys(a);
  const newPropsKeys = Object.keys(b);

  if (oldPropsKeys.length !== newPropsKeys.length) {
    return false;
  }

  for (let i = 0; i < oldPropsKeys.length; i += 1) {
    const propName = oldPropsKeys[i];

    if (propName === "render" && !a[propName] !== !b[propName]) {
      return false;
    }

    if (propName !== "children" && a[propName] !== b[propName]) {
      if (
        typeof a[propName] === "object" &&
        typeof b[propName] === "object" &&
        propsEqual(a[propName], b[propName])
      ) {
        continue;
      }

      return false;
    }

    if (
      propName === "children" &&
      (typeof a[propName] === "string" || typeof b[propName] === "string")
    ) {
      return a[propName] === b[propName];
    }
  }

  return true;
};

const emptyObject = {};

const appendChild = (parentInstance, child) => {
  parentInstance.children.push(child);
};

type IBox = {};

type IStyle = {};

type IProps = {
  style: IStyle,
  src?: string,
  children?: (Instance | TextInstance)[]
};

type IContainer = {
  type: string,
  container: Instance | TextInstance | null,
  children: (Instance | TextInstance)[]
};

type Instance = {
  type: string;
  box: IBox;
  style: IStyle;
  props: { src?: string };
  children: (Instance | TextInstance)[];
  value?: string;
};

type TextInstance = {
  type: "TEXT_INSTANCE";
  value: string;
};

// refer to https://github.com/facebook/react/blob/main/packages/react-reconciler/README.md
const hostConfig: HostConfig<
  string,
  IProps,
  IContainer,
  Instance,
  TextInstance,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,

  isPrimaryRenderer: false,

  warnsIfNotActing: false,

  appendInitialChild: appendChild,

  getInstanceFromNode: () => {
    return null;
  },

  createInstance: (type, { style, children, ...props }) => {
    return {
      type,
      box: {},
      style: style || {},
      props: props || {},
      children: [],
    };
  },

  createTextInstance: (text, rootContainerInstance) => {
    return { type: "TEXT_INSTANCE", value: text };
  },

  finalizeInitialChildren(element, type, props) {
    return false;
  },

  getPublicInstance(instance) {
    return instance;
  },

  prepareForCommit() {
    return null;
  },

  preparePortalMount(containerInfo) {
    // Noop
  },

  clearContainer() {
    // Noop
  },

  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,

  getCurrentEventPriority() {
    return DefaultEventPriority;
  },

  prepareUpdate(element, type, oldProps, newProps) {
    return !propsEqual(oldProps, newProps);
  },

  resetAfterCommit: () => {},

  resetTextContent(element) {
    // Noop
  },

  getRootHostContext() {
    return emptyObject;
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent() {
    return false;
  },

  appendChild,

  appendChildToContainer(parentInstance, child) {
    if (parentInstance.type === "ROOT") {
      parentInstance.container = child;
    } else {
      appendChild(parentInstance, child);
    }
  },

  insertBefore(parentInstance, child, beforeChild) {
    const index = parentInstance.children?.indexOf(beforeChild);

    if (index === undefined) return;

    if (index !== -1 && child) parentInstance.children.splice(index, 0, child);
  },

  removeChild(parentInstance, child) {
    const index = parentInstance.children?.indexOf(child);

    if (index === undefined) return;

    if (index !== -1) parentInstance.children.splice(index, 1);
  },

  removeChildFromContainer(parentInstance, child) {
    const index = parentInstance.children?.indexOf(child);

    if (index === undefined) return;

    if (index !== -1) parentInstance.children.splice(index, 1);
  },

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.value = newText;
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    const { style, ...props } = newProps;
    instance.props = props;
    instance.style = style;
  },

  beforeActiveInstanceBlur: () => {

  },

  afterActiveInstanceBlur: () => {

  },

  prepareScopeUpdate: () => {

  },

  getInstanceFromScope: () => {
    return null;
  },

  detachDeletedInstance: () => {

  }
};

export const createRenderer = () => ReactFiberReconciler(hostConfig);
export const renderer = ReactFiberReconciler(hostConfig);
