import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase, Poem, Comment } from '../../lib/supabase';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function PoemDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    loadPoem();
    loadComments();
    checkUserActions();
  }, [id]);

  const loadPoem = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPoem(data);

      // Increment view count
      await supabase
        .from('poems')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);
    } catch (error) {
      console.error('Error loading poem:', error);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, user:user_profiles(*)')
        .eq('poem_id', id)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const checkUserActions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [likesRes, bookmarksRes] = await Promise.all([
        supabase.from('likes').select('id').eq('user_id', user.id).eq('poem_id', id).single(),
        supabase.from('bookmarks').select('id').eq('user_id', user.id).eq('poem_id', id).single(),
      ]);

      setLiked(!!likesRes.data);
      setBookmarked(!!bookmarksRes.data);
    } catch (error) {
      // User not logged in or no actions yet
    }
  };

  const handleLike = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (liked) {
        await supabase.from('likes').delete().eq('user_id', user.id).eq('poem_id', id);
        setLiked(false);
        if (poem) setPoem({ ...poem, likes_count: poem.likes_count - 1 });
      } else {
        await supabase.from('likes').insert({ user_id: user.id, poem_id: id as string });
        setLiked(true);
        if (poem) setPoem({ ...poem, likes_count: poem.likes_count + 1 });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (bookmarked) {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('poem_id', id);
        setBookmarked(false);
        Alert.alert('Removed', 'Poem removed from bookmarks');
      } else {
        await supabase.from('bookmarks').insert({ user_id: user.id, poem_id: id as string });
        setBookmarked(true);
        Alert.alert('Saved', 'Poem added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = async () => {
    if (!poem) return;
    try {
      await Share.share({
        message: `${poem.title}\n\nby ${poem.author}\n\n${poem.content}\n\nShared from PoetryWorld`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('comments').insert({
        poem_id: id as string,
        user_id: user.id,
        content: newComment,
        approved: false, // Admin needs to approve
      });

      setNewComment('');
      Alert.alert('Success', 'Your comment has been submitted for approval');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  if (!poem) {
    return (
      <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.aiButton}>
          <Sparkles size={24} color="#e94560" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.poemContainer}>
          <Text style={styles.title}>{poem.title}</Text>
          <Text style={styles.author}>by {poem.author}</Text>
          
          <View style={styles.stats}>
            <Text style={styles.stat}>❤️ {poem.likes_count}</Text>
            <Text style={styles.stat}>💬 {poem.comments_count}</Text>
            <Text style={styles.stat}>👁️ {poem.views_count}</Text>
          </View>

          <Text style={styles.content}>{poem.content}</Text>

          {poem.tags && poem.tags.length > 0 && (
            <View style={styles.tags}>
              {poem.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, liked && styles.actionButtonActive]}
            onPress={handleLike}
          >
            <Heart size={24} color={liked ? '#e94560' : '#fff'} fill={liked ? '#e94560' : 'none'} />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={24} color="#fff" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, bookmarked && styles.actionButtonActive]}
            onPress={handleBookmark}
          >
            <Bookmark size={24} color={bookmarked ? '#e94560' : '#fff'} fill={bookmarked ? '#e94560' : 'none'} />
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

          <View style={styles.addComment}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#999"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>
                {comment.user?.name || 'Anonymous'}
              </Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  poemContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  author: {
    fontSize: 18,
    color: '#e94560',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  stat: {
    color: '#999',
    fontSize: 14,
  },
  content: {
    fontSize: 18,
    color: '#fff',
    lineHeight: 32,
    fontFamily: 'serif',
    marginBottom: 24,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#e94560',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 12,
  },
  actionButtonActive: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  commentsSection: {
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  addComment: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comment: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.2)',
  },
  commentAuthor: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  commentContent: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  commentDate: {
    color: '#999',
    fontSize: 12,
  },
});
