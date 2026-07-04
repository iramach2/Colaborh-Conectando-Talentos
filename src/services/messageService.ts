import { supabase } from '../lib/supabase';
import { MESSAGE_COLUMNS } from './queryColumns';

export type MessageSenderType = 'candidate' | 'company';

export type ChatMessage = {
  id: string;
  application_id: string;
  sender_type: MessageSenderType;
  sender_name?: string | null;
  content?: string | null;
  message?: string | null;
  read: boolean;
  created_at: string;
};

const normalizeMessage = (message: ChatMessage): ChatMessage => {
  const text = message.content || message.message || '';
  return {
    ...message,
    content: text,
    message: text,
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object') {
    const err = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };
    return [err.message, err.details, err.hint, err.code ? `Codigo: ${err.code}` : '']
      .filter(Boolean)
      .join(' | ') || JSON.stringify(error);
  }
  return String(error || 'Erro desconhecido');
};

export const fetchMessagesForApplication = async (applicationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(MESSAGE_COLUMNS)
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return ((data || []) as ChatMessage[]).map(normalizeMessage);
};

export const fetchMessagesForApplications = async (applicationIds: string[]) => {
  if (applicationIds.length === 0) return [];

  const { data, error } = await supabase
    .from('messages')
    .select(MESSAGE_COLUMNS)
    .in('application_id', applicationIds)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data || []) as ChatMessage[]).map(normalizeMessage);
};

export const markMessagesAsRead = async (applicationId: string, senderType: MessageSenderType) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('application_id', applicationId)
    .eq('sender_type', senderType);

  if (error) throw error;
};

export const sendMessage = async (
  applicationId: string,
  senderType: MessageSenderType,
  text: string,
) => {
  const cleanText = text.trim();
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        application_id: applicationId,
        sender_type: senderType,
        content: cleanText,
        message: cleanText,
        read: false,
      },
    ])
    .select(MESSAGE_COLUMNS)
    .single();

  if (error) {
    console.warn('Nao foi possivel enviar mensagem diretamente. Tentando RPC send_application_message:', error);

    const rpcResult = await supabase.rpc('send_application_message', {
      target_application_id: applicationId,
      sender_type_input: senderType,
      message_input: cleanText,
    });

    if (rpcResult.error) {
      console.error('RPC send_application_message tambem falhou:', rpcResult.error);
      throw new Error(getErrorMessage(rpcResult.error));
    }

    const [message] = (rpcResult.data || []) as ChatMessage[];
    return message ? normalizeMessage(message) : null;
  }

  return data ? normalizeMessage(data as ChatMessage) : null;
};
