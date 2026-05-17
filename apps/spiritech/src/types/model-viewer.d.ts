declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string
        poster?: string
        alt?: string
        'camera-controls'?: boolean | string
        'auto-rotate'?: boolean | string
        'shadow-intensity'?: string
        'environment-image'?: string
        ar?: boolean | string
        loading?: 'auto' | 'lazy' | 'eager'
        reveal?: 'auto' | 'interaction' | 'manual'
      },
      HTMLElement
    >
  }
}
