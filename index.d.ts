export = ComponentWrapper;
/** @type {import('unified').Plugin<[ComponentWrapperOptions?], import('hast').Root>} */
declare const ComponentWrapper: import('unified').Plugin<[ComponentWrapperOptions?], import('hast').Root>;
declare namespace ComponentWrapper {
    export { ComponentWrapperOptions };
}
type ComponentWrapperOptions = {
    name?: string;
    path?: string;
    props?: string[];
};
