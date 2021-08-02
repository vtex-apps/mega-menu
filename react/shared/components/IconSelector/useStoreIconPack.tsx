import React, { useEffect, useRef, useState } from 'react'

const ICONPACK_URL =
  'https://raw.githubusercontent.com/vtex-apps/store-icons/master/styles/iconpacks/iconpack.svg'

const useStoreIconPack = () => {
  const [svg, setSvg] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isErrored, setIsErrored] = useState(false)
  const [iconPackList, setIconPackList] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(ICONPACK_URL)
      .then((res) => res.text())
      .then(setSvg)
      .catch(setIsErrored)
      .then(() => setIsLoaded(true))
  }, [])

  useEffect(() => {
    if (!svg || iconPackList.length) return

    const list = ref.current?.querySelector('defs')?.children
    const iconIds = Array.from(list ?? []).map((x) => x.id)

    setIconPackList(iconIds)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svg])

  return {
    iconPackList,
    IconPack: (
      <div
        ref={ref}
        className={`svgInline svgInline--${isLoaded ? 'loaded' : 'loading'} ${
          isErrored ? 'svgInline--errored' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: svg }}
        id="store-icon-pack"
      />
    ),
  }
}

export default useStoreIconPack
