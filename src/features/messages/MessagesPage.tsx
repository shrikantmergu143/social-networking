import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Check,
  CheckCheck,
  Info
} from 'lucide-react';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setActiveConversation,
  sendMessage,
  receiveMessage,
  setTypingStatus,
  markMessagesAsRead
} from './messagesSlice';
import { socketService } from '../../app/socket';
import { ROUTES } from '../../routes/paths';
import type { ChatMessage } from '../../types';
import styles from './MessagesPage.module.css';

export const MessagesPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversations, messages, activeConversationId } = useAppSelector(state => state.messages);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [inputText, setInputText] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Connect to socket and setup real-time listeners
  useEffect(() => {
    const socket = socketService.connect();

    const handleReceiveMessage = (msg: ChatMessage) => {
      const myId = currentUser?.id || 'usr_me';
      if (msg.senderId !== myId) {
        dispatch(receiveMessage({
          conversationId: msg.conversationId,
          text: msg.text,
          senderId: msg.senderId,
          imageUrl: msg.imageUrl
        }));
      }
    };

    const handleTyping = (data: { conversationId: string; isTyping: boolean; senderId: string }) => {
      dispatch(setTypingStatus({ conversationId: data.conversationId, isTyping: data.isTyping }));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing', handleTyping);
    };
  }, [dispatch, currentUser?.id]);

  // Sync route param with activeConversationId and join socket room
  useEffect(() => {
    const targetConvId = conversationId || activeConversationId;
    if (conversationId && conversationId !== activeConversationId) {
      dispatch(setActiveConversation(conversationId));
    }
    if (targetConvId) {
      dispatch(markMessagesAsRead(targetConvId));
      socketService.joinConversation(targetConvId);
    }
  }, [conversationId, activeConversationId, dispatch]);

  const activeConv = conversations.find(c => c.id === (conversationId || activeConversationId)) || conversations[0];
  const activeMessages = activeConv ? (messages[activeConv.id] || []) : [];

  const filteredConversations = conversations.filter(c =>
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

  const handleSend = (e: React.FormEvent) => {
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

    // Optimistic local dispatch
    dispatch(sendMessage({
      conversationId: activeConv.id,
      text
    }));

    // Broadcast over WebSocket
    socketService.sendMessage({
      conversationId: activeConv.id,
      text,
      senderId: currentUser?.id || 'usr_me'
    });
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
                        <span title="Seen by match"><CheckCheck size={14} color="#38bdf8" /></span>
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
          </div>

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
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AppEmptyState
            icon={<Sparkles size={36} />}
            title="Select a conversation"
            description="Choose a conversation from the left to start chatting, or browse your matches."
          />
        </div>
      )}
    </div>
  );
};
