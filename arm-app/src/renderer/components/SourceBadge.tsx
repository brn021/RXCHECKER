import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SourceBadgeProps {
  type: 'RCM' | 'BNF' | 'ALERT' | 'CALC' | 'Guidelines' | 'Infomed';
  onClick?: () => void;
  showIcon?: boolean;
}

const SourceBadge: React.FC<SourceBadgeProps> = ({ 
  type, 
  onClick, 
  showIcon = false 
}) => {
  const getStyles = () => {
    switch (type) {
      case 'RCM':
        return 'source-badge-rcm';
      case 'BNF':
        return 'source-badge-bnf';
      case 'ALERT':
        return 'source-badge-alert';
      case 'CALC':
        return 'source-badge-calc';
      case 'Guidelines':
        return 'source-badge-rcm'; // Same as RCM
      case 'Infomed':
        return 'source-badge-bnf'; // Same as BNF
      default:
        return 'source-badge-rcm';
    }
  };

  const getText = () => {
    switch (type) {
      case 'RCM':
        return 'RCM';
      case 'BNF':
        return 'BNF';
      case 'ALERT':
        return 'ALERTA';
      case 'CALC':
        return 'CALC';
      case 'Guidelines':
        return 'GUIDE';
      case 'Infomed':
        return 'INFO';
      default:
        return type;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <span
      className={`${getStyles()} ${onClick ? 'cursor-pointer hover:opacity-80' : ''} flex items-center gap-1`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {getText()}
      {showIcon && onClick && <ExternalLink className="w-3 h-3" />}
    </span>
  );
};

export default SourceBadge;