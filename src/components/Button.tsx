import { useRouter } from 'next/navigation'

import { AppConfig } from '@/lib/AppConfig'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean
  border?: boolean
  link?: string
  noGutter?: boolean
  noBorderRadius?: boolean
}

const WithLink = ({ link, children }: { link: ButtonProps['link']; children: JSX.Element }) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    if (!link) return

    router.push(link)
  }

  return link ? (
    <a href={link} className="inline-flex" onClick={handleClick}>
      {children}
    </a>
  ) : (
    children
  )
}

const Button = ({
  children,
  className,
  small = false,
  border,
  onClick,
  link,
  noBorderRadius,
  noGutter,
  ...props
}: ButtonProps) => {
  const buttonClass = small
    ? `${noGutter ? 'p-0' : 'px-2 py-1'} text-small`
    : `${noGutter ? 'p-0' : 'px-3 py-2'}`

  return (
    <WithLink link={link}>
      <button
        type="button"
        onClick={onClick}
        className={`${border ? 'border' : ''} ${buttonClass} flex items-center gap-1 leading-none ${
          !noBorderRadius && AppConfig.ui.twBorderRadius
        } ${className}`}
        {...props}
      >
        {children}
      </button>
    </WithLink>
  )
}

export default Button
