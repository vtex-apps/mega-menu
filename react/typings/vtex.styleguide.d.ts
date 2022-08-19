/* eslint-disable @typescript-eslint/no-explicit-any */

import type PropTypes from 'prop-types'
import type React from 'react'
import 'vtex.styleguide'

declare const propTypes: any
declare const Progress: React.FC<PropTypes.InferProps<typeof propTypes>>

declare module 'vtex.styleguide' {
  export const Button: React.FC<PropTypes.InferProps<any>>
  export const Card: React.FC<PropTypes.InferProps<any>>
  export const Checkbox: React.FC<PropTypes.InferProps<any>>
  export const Input: React.FC<PropTypes.InferProps<any>>
  export const Tag: React.FC<PropTypes.InferProps<any>>
  export const Alert: React.FC<PropTypes.InferProps<any>>
  export const Layout: React.FC<PropTypes.InferProps<any>>
  export const PageHeader: React.FC<PropTypes.InferProps<any>>
  export const Dropdown: React.FC<PropTypes.InferProps<any>>
  export const ButtonWithIcon: React.FC<PropTypes.InferProps<any>>
  export const InputSearch: React.FC<PropTypes.InferProps<any>>
  export const Table: React.FC<PropTypes.InferProps<any>>
  export const Toggle: React.FC<PropTypes.InferProps<any>>
  export const PageBlock: React.FC<PropTypes.InferProps<any>>
  export const Tabs: React.FC<PropTypes.InferProps<any>>
  export const Tab: React.FC<PropTypes.InferProps<any>>
  export const Collapsible: React.FC<PropTypes.InferProps<any>>
  export const Textarea: React.FC<PropTypes.InferProps<any>>
  export const Spinner: React.FC<PropTypes.InferProps<any>>
  export const ModalDialog: React.FC<PropTypes.InferProps<any>>
  export const Modal: React.FC<PropTypes.InferProps<any>>
  export const EmptyState: React.FC<PropTypes.InferProps<any>>
  /* eslint-disable @typescript-eslint/naming-convention */
  export const EXPERIMENTAL_Select: React.FC<PropTypes.InferProps<any>>
}
