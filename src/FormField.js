import React, { Component, Children, cloneElement } from 'react';
import type { SchemaType } from 'redux-jsonschema';
import { UncontrolledTooltip } from 'reactstrap';
import { get } from 'lodash';

const LABEL_PROP = 'title';

const DEFAULT_SHOW = ({ meta }) => meta.touched;

export default class FormField extends Component {
  static defaultProps = {
    required: false,
    tag: 'div',
    labelProps: {},
    errorProps: {},
    warningProps: {},
    tooltipProps: {}
  };
  props: {
    name: string,
    schema: SchemaType,
    required: boolean,
    tag: string,
    errorProps: MessagePropsType,
    warningProps: MessagePropsType,
    labelProps: {
      tag: string,
      requiredColor: string
    },
    tooltipProps: {
      placement: string
    },
    meta: { [string]: any },
    children: React.Element<*> | [React.Element<*>]
  };

  constructor(props) {
    super(props);
    this.state = { Label: null };
  }

  renderTooltip(labelId, schema, tooltipProps) {
    const { placement, ...rest } = tooltipProps;
    return (
      <UncontrolledTooltip target={labelId} placement={placement} {...rest}>
        {schema.description}
      </UncontrolledTooltip>
    );
  }

  render() {
    const {
      name,
      styles,
      required,
      tag: Tag,
      schema,
      tooltipProps,
      labelProps: {
        tag: LabelTag = 'label',
        requiredColor = 'red',
        ...labelProps
      },
      errorProps: {
        tag: ErrorTag = 'div',
        show: showError = DEFAULT_SHOW,
        ...errorProps
      },
      warningProps: {
        tag: WarningTag = 'div',
        show: showWarning = DEFAULT_SHOW,
        ...warningProps
      },
      meta: { error, warning },
      input,
      ...rest
    } = this.props;
    const label = get(schema, LABEL_PROP);
    const labelId = `${name}-label`;
    return (
      <Tag {...rest}>
        <LabelTag
          id={labelId}
          ref={e => {
            this._label = e;
          }}
          for={name}
          {...labelProps}
        >
          {required && <span style={{ color: requiredColor }}>*</span>}
          {label}
        </LabelTag>

        {schema.description &&
          this.renderTooltip(labelId, schema, tooltipProps)}

        {Children.map(child =>
          cloneElement(child, { input, id: name, schema, ...rest })
        )}

        {showError(this.props) &&
          error &&
          <ErrorTag id={`${name}-error`} {...errorProps}>
            {error}
          </ErrorTag>}

        {showWarning(this.props) &&
          warning &&
          <WarningTag id={`${name}-warning`} {...warningProps}>
            {warning}
          </WarningTag>}
      </Tag>
    );
  }
}
