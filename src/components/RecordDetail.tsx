import { MedicalRecord, categoryConfig } from '@/lib/types';
import { X, FileText, Image, Download } from 'lucide-react';

interface RecordDetailProps {
  record: MedicalRecord;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export function RecordDetail({ record, onClose, onDelete }: RecordDetailProps) {
  const config = categoryConfig[record.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-lg border border-border/50 w-[calc(100vw-2rem)] max-w-lg max-h-[min(90vh,90dvh)] overflow-y-auto overscroll-contain p-4 sm:p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>{config.label}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-foreground break-words">{record.title}</h2>
        <p className="text-sm text-muted-foreground mt-1 break-words">{record.doctor} · {record.hospital}</p>
        <p className="text-xs text-primary font-medium mt-2">
          {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        {record.summary && (
          <p className="text-sm text-muted-foreground mt-4 p-3 rounded-xl bg-secondary/50">{record.summary}</p>
        )}

        {record.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {record.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{tag}</span>
            ))}
          </div>
        )}

        {/* File preview */}
        {record.fileData && (
          <div className="mt-4">
            {record.fileMimeType?.startsWith('image') ? (
              <img src={record.fileData} alt={record.title} className="rounded-xl max-h-64 w-full object-contain bg-secondary" />
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                <FileText className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{record.fileName || 'Document'}</p>
                  <p className="text-xs text-muted-foreground">{record.fileMimeType}</p>
                </div>
                <a href={record.fileData} download={record.fileName} className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Download className="w-4 h-4 text-primary" />
                </a>
              </div>
            )}
          </div>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(record.id)}
            className="w-full mt-6 py-2.5 rounded-xl bg-destructive/10 text-destructive font-medium text-sm hover:bg-destructive/20 transition-colors"
          >
            Delete Record
          </button>
        )}
      </div>
    </div>
  );
}
