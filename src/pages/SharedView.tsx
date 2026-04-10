import { useSharing } from '@/hooks/use-sharing';
import { useRecords } from '@/hooks/use-records';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, Calendar, ArrowLeft } from 'lucide-react';
import { categoryConfig } from '@/lib/types';

const SharedView = () => {
  const { linkId } = useParams();
  const { sharedLinks } = useSharing();
  const { getRecord } = useRecords();
  const navigate = useNavigate();

  const link = sharedLinks.find(l => l.id === linkId);

  const backBlock = (
    <div className="mt-10 pt-6 border-t border-border/50">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary"
      >
        <ArrowLeft className="w-4 h-4 text-primary" />
        Back to Dashboard
      </button>
    </div>
  );

  if (!link) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-4 py-8 pb-10">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Link Not Found</h1>
            <p className="text-muted-foreground mt-2">This share link doesn't exist or has been removed.</p>
          </div>
        </div>
        {backBlock}
      </div>
    );
  }

  if (!link.isActive || new Date(link.expiresAt).getTime() < Date.now()) {
    return (
      <div className="min-h-screen bg-background flex flex-col px-4 py-8 pb-10">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-health-orange mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Link Expired</h1>
            <p className="text-muted-foreground mt-2">This share link has expired and is no longer accessible.</p>
          </div>
        </div>
        {backBlock}
      </div>
    );
  }

  const records = link.recordIds.map(id => getRecord(id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 pb-10">
      <div className="max-w-3xl mx-auto flex flex-col min-h-0">
        <div className="flex items-start sm:items-center gap-3 mb-6 min-w-0">
          <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-foreground break-words">Shared Medical Records</h1>
            <p className="text-sm text-muted-foreground break-words">
              Shared by patient · {link.permission === 'view' ? 'View only' : 'View & Download'} · 
              Expires {new Date(link.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {records.map(record => {
            if (!record) return null;
            const config = categoryConfig[record.category];
            return (
              <div key={record.id} className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{record.title}</h3>
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>{config.label}</span>
                  </div>
                </div>
                {record.summary && <p className="text-sm text-muted-foreground">{record.summary}</p>}
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(record.date).toLocaleDateString()}</span>
                  <span>{record.doctor}</span>
                </div>
                {record.fileData && record.fileMimeType?.startsWith('image') && (
                  <img src={record.fileData} alt={record.title} className="mt-3 rounded-xl max-h-48 w-full object-contain bg-secondary" />
                )}
              </div>
            );
          })}
        </div>
        {backBlock}
      </div>
    </div>
  );
};

export default SharedView;
