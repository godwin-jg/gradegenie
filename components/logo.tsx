import Link from "next/link"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "positive" | "negative"
  asChild?: boolean
}

export function Logo({
  className = "",
  showText = true,
  size = "md",
  variant = "positive",
  asChild = false,
}: LogoProps) {
  const sizes = {
    sm: { logo: 24, height: 24 },
    md: { logo: 32, height: 32 },
    lg: { logo: 48, height: 48 },
  }

  const textColor = variant === "positive" ? "text-gray-800 dark:text-white" : "text-white"
  const circleFill = variant === "positive" ? "#00BF9A" : "white"
  const pathStroke = variant === "positive" ? "white" : "#00BF9A"

  const LogoContent = (
    <>
      <div className="relative">
        <svg
          width={sizes[size].logo}
          height={sizes[size].logo}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="60" fill={circleFill} />
          <path
            d="M34.5 60L52.5 78L85.5 45"
            stroke={pathStroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showText && (
        <span
          className={`ml-2 font-onest font-bold ${textColor} ${
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl"
          }`}
        >
          GradeGenie
        </span>
      )}
    </>
  )

  if (asChild) {
    return <div className={`flex items-center ${className}`}>{LogoContent}</div>
  }

  return (
    <Link href="/" className={`flex items-center ${className}`}>
      {LogoContent}
    </Link>
  )
}

export default Logo
