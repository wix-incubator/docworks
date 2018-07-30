import Element from 'ui/Element';
import HiddenCollapsedMixin from './mixins/HiddenCollapsedMixin';
import ClickableMixin from './mixins/ClickableMixin';
import ContainableMixin from './mixins/ContainableMixin';
import mixin from 'privates/utils/mixin';
import StyleMixin from './mixins/styleMixins/StyleMixin';

/**
 * @class Box
 * @summary Container <a href="https://support.wix.com/en/article/container-boxes" target="_blank">boxes</a>
 *  are used to structure your site. You can <a href="https://support.wix.com/en/article/attaching-elements-to-a-box" target="_blank">attach</a>
 *  any element to a container box and move the box around, which is a useful
 *  way to to keep elements together. Some actions performed on a box affect the
 *  elements it contains. For example, [hiding](#hide) a box also effectively
 *  hides all the elements in the box, although the values of the
 *  [hidden](#hidden) properties of the elements contained in the box do not change.
 * @memberof $w
 * @tagname Box
 * @viewername mobile.core.components.Container
 */
class Box extends Element {

  /**
   * @member style
   * @label property
   * @syntax
   * get style(): Style
   * @summary Gets an object containing information about the box's styles.
   * @description
   *  The following styles can be used with boxes:
   *  + [`backgroundColor`]($w.Style.html#backgroundColor)
   *  + [`borderColor`]($w.Style.html#borderColor)
   *  + [`borderWidth`]($w.Style.html#borderWidth)
   * @note
   *  Not all styles can be used on all box designs. To determine which styles
   *  work with a specific box design, go to the **Box Design** panel in
   *  the Editor, choose a design, and click **Customize Design**. The design
   *  options that you see in the **Box Design** panel for your particular
   *  box are the styles you can use in your code.
   * @snippet [BackgroundColorMixin-backgroundColor_set.es6=Set the background color]
   * @snippet [BackgroundColorMixin-backgroundColor_get.es6=Get the background color]
   * @type {$w.Style}
   * @memberof $w.Box
   * @readonly
   * @override
   */

}

mixin(Box.prototype, HiddenCollapsedMixin.prototype);
mixin(Box.prototype, ClickableMixin.prototype);
mixin(Box.prototype, ContainableMixin.prototype);
mixin(Box.prototype, StyleMixin.prototype);

export default Box;
