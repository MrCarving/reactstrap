import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Reference } from 'react-popper';
import { DropdownContext } from './DropdownContext';
import { mapToCssModules, tagPropType } from './utils';
import Button from './Button';

const propTypes = {
  caret: PropTypes.bool,
  color: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  'aria-haspopup': PropTypes.bool,
  split: PropTypes.bool,
  tag: tagPropType,
  nav: PropTypes.bool,
  innerRef: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.func,
  ]),
};

const defaultProps = {
  color: 'secondary',
  'aria-haspopup': true,
};

class DropdownToggle extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.disabled || this.context.disabled) {
      e.preventDefault();
      return;
    }

    if (this.props.nav && !this.props.tag) {
      e.preventDefault();
    }

    if (this.props.onClick) {
      this.props.onClick(e);
    }

    this.context.toggle(e);
  }

  getRole() {
    return this.context.menuRole || this.props['aria-haspopup'];
  }

  render() {
    const {
      className,
      color,
      cssModule,
      caret,
      split,
      nav,
      tag,
      innerRef,
      ...props
    } = this.props;
    const ariaLabel = props['aria-label'] || 'Toggle Dropdown';
    const classes = mapToCssModules(
      classNames(className, {
        'dropdown-toggle': caret || split,
        'dropdown-toggle-split': split,
        'nav-link': nav,
      }),
      cssModule,
    );
    const children =
      typeof props.children !== 'undefined' ? (
        props.children
      ) : (
        <span className="visually-hidden">{ariaLabel}</span>
      );

    let Tag;

    if (nav && !tag) {
      Tag = 'a';
      props.href = '#';
    } else if (!tag) {
      Tag = Button;
      props.color = color;
      props.cssModule = cssModule;
    } else {
      Tag = tag;
    }

    //extracted the rendering of the Tag component
    const returnFunction = ({ ref }) => {
      const handleRef = (tagRef) => {
        ref(tagRef);
        const { onToggleRef } = this.context;
        if (onToggleRef) onToggleRef(tagRef);
      };

      return (
        <Tag
          {...props}
          {...{ [typeof Tag === 'string' ? 'ref' : 'innerRef']: handleRef }}
          className={classes}
          onClick={this.onClick}
          aria-expanded={this.context.isOpen}
          aria-haspopup={this.getRole()}
          children={children}
        />
      );
    }

    //No Reference component if the component is in Navbar
    if (this.context.inNavbar) {
      return (
        <>
          {returnFunction({ ref: this.context.onToggleRef })}
        </>
      );
    }

    //Normal rendering if component not in NavBar
    return (

      <Reference innerRef={innerRef} >
        {returnFunction}
      </Reference>
    );
 
  }
}

DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;
DropdownToggle.contextType = DropdownContext;

export default DropdownToggle;
