'use client'

import Image, { type ImageProps } from 'next/image'

type RemoteImageProps = Omit<ImageProps, 'loader' | 'unoptimized'>

export function RemoteImage(props: RemoteImageProps) {
  return (
    <Image
      {...props}
      alt={props.alt ?? ''}
      loader={({ src }) => src}
      unoptimized
    />
  )
}
