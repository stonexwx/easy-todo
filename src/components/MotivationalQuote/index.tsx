import React from 'react';
import { MotivationalQuoteProps } from './types';
import './style.scss';

const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ quote, author, className = '' }) => {
  return (
    <div className={`motivational-quote ${className}`} data-testid="motivational-quote">
      <p className="motivational-quote__text" data-testid="quote-text">
        {quote}
      </p>
      {author && (
        <p className="motivational-quote__author" data-testid="quote-author">
          {author}
        </p>
      )}
    </div>
  );
};

export default MotivationalQuote;
