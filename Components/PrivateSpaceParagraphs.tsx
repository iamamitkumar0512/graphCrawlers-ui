'use client';

import { useState } from 'react';
import { useSpace } from '@graphprotocol/hypergraph-react';
import { ParagraphsList } from './ParagraphsList';
import { Button } from './ui/button';

interface PrivateSpaceParagraphsProps {
  spaceId: string;
}

export function PrivateSpaceParagraphs({ spaceId }: PrivateSpaceParagraphsProps) {
  const { name, ready } = useSpace({ mode: 'private' });
  const [showParagraphs, setShowParagraphs] = useState(false);

  if (!ready) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading space...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publish Paragraphs to {name}</h2>
          <p className="text-muted-foreground">Publish your scraped content to both private and public spaces</p>
        </div>
        <Button onClick={() => setShowParagraphs(!showParagraphs)} variant={showParagraphs ? 'outline' : 'default'}>
          {showParagraphs ? 'Hide Paragraphs' : 'Show Paragraphs'}
        </Button>
      </div>

      {/* Paragraphs List */}
      {showParagraphs && (
        <div className="border rounded-lg p-6 bg-white">
          <ParagraphsList spaceId={spaceId} />
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How to publish paragraphs:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Show Paragraphs" to view available content</li>
          <li>• Each paragraph card shows content from your scraped data</li>
          <li>• Click "Publish to Hypergraph & Public Space" to store the content in both private and public spaces</li>
          <li>• The system will automatically find the company's public space and publish there as well</li>
          <li>• The data will be structured according to your schema (Paragraph → PostData → Author/Metrics)</li>
        </ul>
      </div>
    </div>
  );
}
