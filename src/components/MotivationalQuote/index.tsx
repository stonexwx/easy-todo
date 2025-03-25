import React from 'react';
import Card from '../Card';
import { MotivationalQuoteProps } from './types';
import './style.scss';

const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ text, author, className = '' }) => {
  return (
    <Card
      className={`motivational-quote ${className}`}
      variant="glass"
      padding="lg"
      customStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
      }}
    >
      <div className="motivational-quote__text">{text}</div>
      <div className="motivational-quote__author">{author}</div>
    </Card>
  );
};

export default MotivationalQuote;
