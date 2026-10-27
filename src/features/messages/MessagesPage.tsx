import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  CheckCircle,
  LockKeyhole,
  Sparkles,
  Check,
  CheckCheck,
  Info
} from 'lucide-react';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setActiveConversation,
  receiveMessage,
  replaceConversations,
  setConversationMessages,
  appendServerMessage,
  setTypingStatus,
  markMessagesAsRead,
  updateMessageReceipts
} from './messagesSlice';
import { socketService } from '../../app/socket';
import { ROUTES } from '../../routes/paths';
import type { ChatMessage } from '../../types';
import styles from './MessagesPage.module.css';
import { socialApi } from '../../lib/social.api';
import { message } from '../../app/notification';

export const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConversationIdRef = useRef<string | null>(null);

  const { conversations, messages, activeConversationId } = useAppSelector(state => state.messages);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [inputText, setInputText] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [loadingMessagesForConversationId, setLoadingMessagesForConversationId] = useState<string | null>(null);
  const [privateAccessDeniedConversationId, setPrivateAccessDeniedConversationId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    socialApi.getConversations()
      .then(data => { if (active) dispatch(replaceConversations(data)); })
      .catch(error => { if (active) message.error(error instanceof Error ? error.message : 'Unable to load conversations.'); })
      .finally(() => { if (active) setIsLoadingConversations(false); });
    return () => { active = false; };
  }, [dispatch]);

  // Connect to socket and setup real-time listeners
  useEffect(() => {
    const socket = socketService.connect();

    const handleReceiveMessage = (msg: ChatMessage) => {
      const myId = currentUser?.id || 'usr_me';
      dispatch(receiveMessage({
        message: msg,
        currentUserId: myId
      }));
      if (msg.senderId !== myId) socket.emit('message_delivered', msg.id);
      if (activeConversationIdRef.current === msg.conversationId) {
        void socialApi.markConversationRead(msg.conversationId)
          .then(() => dispatch(markMessagesAsRead(msg.conversationId)))
          .catch(error => message.error(error instanceof Error ? error.message : 'Unable to mark messages as read.'));
      }
    };

    const handleTyping = (data: { conversationId: string; isTyping: boolean; senderId: string }) => {
      dispatch(setTypingStatus({ conversationId: data.conversationId, isTyping: data.isTyping }));
    };

    const handleMessageReceiptsUpdated = (data: { conversationId: string; receipts: NonNullable<ChatMessage['receipts']> }) => {
      dispatch(updateMessageReceipts({
        ...data,
        currentUserId: currentUser?.id || 'usr_me'
      }));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('message_receipts_updated', handleMessageReceiptsUpdated);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('message_receipts_updated', handleMessageReceiptsUpdated);
      socketService.disconnect();
    };
  }, [dispatch, currentUser?.id]);

  // Sync route param with activeConversationId and join socket room
  useEffect(() => {
    const targetConvId = conversationId || activeConversationId;
    if (conversationId && conversationId !== activeConversationId) {
      dispatch(setActiveConversation(conversationId));
    }
    if (targetConvId) {
      socketService.joinConversation(targetConvId);
    }
  }, [conversationId, activeConversationId, dispatch]);

  const activeConv = conversationId
    ? conversations.find(c => c.id === conversationId)
    : conversations.find(c => c.id === activeConversationId) || conversations[0];
  activeConversationIdRef.current = activeConv?.id ?? null;
  const activeMessages = activeConv ? (messages[activeConv.id] || []) : [];
  const isPrivateAccessDenied = Boolean(
    activeConv && privateAccessDeniedConversationId === activeConv.id
  );
  const isLoadingMessages = Boolean(
    activeConv && loadingMessagesForConversationId === activeConv.id
  );
  const isChatRestricted = isLoadingMessages || isPrivateAccessDenied;

  useEffect(() => {
    if (!activeConv) return;
    let active = true;
    setLoadingMessagesForConversationId(activeConv.id);
    socialApi.getMessages(activeConv.id)
      .then(async data => {
        if (!active) return;
        setPrivateAccessDeniedConversationId(current => current === activeConv.id ? null : current);
        dispatch(setConversationMessages({ conversationId: activeConv.id, messages: data }));
        await socialApi.markConversationRead(activeConv.id);
        if (active) dispatch(markMessagesAsRead(activeConv.id));
      })
      .catch(error => {
        if (!active) return;
        if (error instanceof Error && error.message.includes('approved follower')) {
          dispatch(setConversationMessages({ conversationId: activeConv.id, messages: [] }));
          setPrivateAccessDeniedConversationId(activeConv.id);
          return;
        }
        message.error(error instanceof Error ? error.message : 'Unable to load messages.');
      })
      .finally(() => {
        if (active) setLoadingMessagesForConversationId(null);
      });
    return () => { active = false; };
  }, [activeConv?.id, currentUser?.id, dispatch]);

  const filteredConversations = conversations.filter?.(c =>
    c.participant.fullName.toLowerCase().includes(filterSearch.toLowerCase()) ||
    c.lastMessage?.text.toLowerCase().includes(filterSearch.toLowerCase())
  );

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConv?.isTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (activeConv) {
      socketService.sendTyping({
        conversationId: activeConv.id,
        isTyping: e.target.value.length > 0,
        senderId: currentUser?.id || 'usr_me'
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const text = inputText.trim();
    setInputText('');

    // Stop typing indicator on send
    socketService.sendTyping({
      conversationId: activeConv.id,
      isTyping: false,
      senderId: currentUser?.id || 'usr_me'
    });

    try {
      const savedMessage = await socialApi.sendMessage(activeConv.id, { text });
      dispatch(appendServerMessage(savedMessage));
    } catch (error) {
      if (error instanceof Error && error.message.includes('approved follower')) {
        dispatch(setConversationMessages({ conversationId: activeConv.id, messages: [] }));
        setPrivateAccessDeniedConversationId(activeConv.id);
        setInputText('');
        return;
      }
      setInputText(text);
      message.error(error instanceof Error ? error.message : 'Unable to send message.');
    }
  };

  const quickPrompts = [
    "Coffee this week? ☕",
    "What kind of music are you listening to?",
    "Loved your latest post in the feed!",
    "Are you free this weekend?"
  ];

  return (
    <div className={styles.chatRoot}>
      {/* Conversations List Panel */}
      <div className={`${styles.convListPanel} ${conversationId ? styles.hiddenOnMobile : ''}`}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>Messages</div>
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Search conversations..."
            className={styles.convSearchInput}
          />
        </div>

        <div className={`${styles.convListScroll} hide-scrollbar`}>
          {filteredConversations.map(conv => {
            const isActive = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                className={`${styles.convItem} ${isActive ? styles.convItemActive : ''}`}
                onClick={() => {
                  dispatch(setActiveConversation(conv.id));
                  socketService.joinConversation(conv.id);
                  navigate(ROUTES.CONVERSATION(conv.id));
                }}
              >
                <AppAvatar
                  src={conv.participant.avatar}
                  alt={conv.participant.fullName}
                  size={46}
                  isVerified={conv.participant.isVerified}
                  isOnline={conv.participant.isOnline}
                />
                <div className={styles.convContent}>
                  <div className={styles.convTopRow}>
                    <span className={styles.convName}>{conv.participant.fullName}</span>
                    <span className={styles.convTime}>{conv.updatedAt}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={styles.convSnippet}>
                      {conv.isTyping ? (
                        <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>typing...</span>
                      ) : (
                        conv.lastMessage?.text || 'Start conversation'
                      )}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className={styles.unreadPill}>{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Active Chat Stage */}
      {activeConv ? (
        <div className={styles.chatStage}>
          {/* Header */}
          <div className={styles.stageHeader}>
            <div className={styles.stageHeaderLeft}>
              <button
                className={styles.backBtn}
                onClick={() => navigate(ROUTES.MESSAGES)}
                aria-label="Back to conversations"
              >
                <ArrowLeft size={20} />
              </button>
              <AppAvatar
                src={activeConv.participant.avatar}
                alt={activeConv.participant.fullName}
                size={38}
                isVerified={activeConv.participant.isVerified}
                isOnline={activeConv.participant.isOnline}
              />
              <div>
                <div className={styles.stageName}>
                  {activeConv.participant.fullName}
                  {activeConv.participant.isVerified && (
                    <CheckCircle size={15} fill="#38bdf8" color="white" />
                  )}
                </div>
                <div className={styles.stageStatus}>
                  {activeConv.isTyping
                    ? 'typing...'
                    : activeConv.participant.isOnline
                    ? 'Active now'
                    : `Last active ${activeConv.participant.lastActive}`}
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => navigate(ROUTES.PROFILE(activeConv.participant.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                title="View Profile Details"
              >
                <Info size={20} />
              </button>
            </div>
          </div>

          {/* Messages scroll */}
          <div className={`${styles.messagesScroll} hide-scrollbar`}>
            {isLoadingMessages ? (
              <div className={styles.privateAccessNotice} role="status">
                <p>Loading messages...</p>
              </div>
            ) : isPrivateAccessDenied ? (
              <div className={styles.privateAccessNotice} role="status">
                <div className={styles.privateAccessIcon}>
                  <LockKeyhole size={24} />
                </div>
                <h2>Chat is waiting for approval</h2>
                <p>
                  {activeConv.participant.fullName}'s profile is private. Send a follow request from their profile;
                  you can view and message them after they approve it.
                </p>
                <AppButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.PROFILE(activeConv.participant.id))}
                >
                  View profile and request to follow
                </AppButton>
                <span className={styles.privateAccessHint}>
                  The profile owner can review requests in Follow Requests.
                </span>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  🔒 End-to-end encrypted real-time chat · Matched on Aura
                </div>

                {activeMessages.map(msg => {
                  const isMine = msg.senderId === (currentUser?.id || 'usr_me');
                  return (
                    <div
                      key={msg.id}
                      className={`${styles.messageRow} ${isMine ? styles.myMessage : styles.theirMessage}`}
                    >
                      <div className={`${styles.bubble} ${isMine ? styles.myBubble : styles.theirBubble}`}>
                        {msg.text}
                      </div>
                      <div className={styles.metaText}>
                        <span>{msg.timestamp}</span>
                        {isMine && (
                          msg.status === 'read' ? (
                            <span title="Read by recipient"><CheckCheck size={14} color="#38bdf8" /></span>
                          ) : msg.status === 'delivered' ? (
                            <span title="Delivered to recipient"><CheckCheck size={14} color="var(--text-tertiary)" /></span>
                          ) : (
                            <span title="Sent"><Check size={14} color="var(--text-tertiary)" /></span>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}

                {activeConv.isTyping && (
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDot} style={{ animationDelay: '0ms' }} />
                    <span className={styles.typingDot} style={{ animationDelay: '200ms' }} />
                    <span className={styles.typingDot} style={{ animationDelay: '400ms' }} />
                    <span>{activeConv.participant.fullName.split(' ')[0]} is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {!isChatRestricted && (
            <>
              {/* Quick Prompts */}
              <div className={`${styles.quickPrompts} hide-scrollbar`}>
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.promptChip}
                    onClick={() => {
                      setInputText(prompt);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className={styles.inputBar}>
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={`Message ${activeConv.participant.fullName.split(' ')[0]}...`}
                  className={styles.chatInput}
                />
                <button type="submit" className={styles.sendBtn} title="Send message">
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <AppEmptyState
            icon={<Sparkles size={36} />}
            title={conversationId ? (isLoadingConversations ? 'Loading conversation' : 'Conversation not found') : 'Select a conversation'}
            description={conversationId
              ? isLoadingConversations
                ? 'Your conversation is loading.'
                : 'This conversation is unavailable. Return to your messages and select another conversation.'
              : 'Choose a conversation from the left to start chatting, or browse your matches.'}
          />
          {conversationId && !isLoadingConversations && (
            <button
              type="button"
              onClick={() => navigate(ROUTES.MESSAGES)}
              style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}
            >
              Back to messages
            </button>
          )}
        </div>
      )}
    </div>
  );
};
