import crestechLogo from '../../crestech-purple-logo.svg';

interface BrandMarkProps {
  className?: string;
  alt?: string;
}

export default function BrandMark({ className = 'h-10 w-auto', alt = 'CRESTECH logo' }: BrandMarkProps) {
  return <img src={crestechLogo} alt={alt} className={className} />;
}
