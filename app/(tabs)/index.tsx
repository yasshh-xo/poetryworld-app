import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase, Poem } from '../../lib/supabase';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPoems();
  }, []);

  const loadPoems = async () => {
    try {
      const { data, error } = await supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPoems(data || []);
    } catch (error) {
      console.error('Error loading poems:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPoems();
  };

  const handleLike = async (poemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('likes').insert({
        user_id: user.id,
        poem_id: poemId,
      });

      // Update local state
      setPoems(poems.map(p =>
        p.id === poemId ? { ...p, likes_count: p.likes_count + 1 } : p
      ));
    } catch (error) {
      console.error('Error liking poem:', error);
    }
  };

  const handleBookmark = async (poemId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('bookmarks').insert({
        user_id: user.id,
        poem_id: poemId,
      });
    } catch (error) {
      console.error('Error bookmarking poem:', error);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
        <Text style={styles.loadingText}>Loading poems...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PoetryWorld</Text>
        <Text style={styles.headerSubtitle}>Discover beautiful poetry</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {poems.map((poem) => (
          <TouchableOpacity
            key={poem.id}
            style={styles.poemCard}
            onPress={() => router.push(`/poem/${poem.id}`)}
          >
            <LinearGradient
              colors={['rgba(233, 69, 96, 0.1)', 'rgba(15, 52, 96, 0.1)']}
              style={styles.cardGradient}
            >
              <Text style={styles.poemTitle}>{poem.title}</Text>
              <Text style={styles.poemAuthor}>by {poem.author}</Text>
              <Text style={styles.poemPreview} numberOfLines={4}>
                {poem.content}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(poem.id)}
                >
                  <Heart size={20} color="#e94560" />
                  <Text style={styles.actionText}>{poem.likes_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={20} color="#e94560" />
                  <Text style={styles.actionText}>{poem.comments_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookmark(poem.id)}
                >
                  <Bookmark size={20} color="#e94560" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={20} color="#e94560" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e94560',
    marginTop: 5,
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
  poemCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    borderRadius: 16,
  },
  poemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'serif',
  },
  poemAuthor: {
    fontSize: 14,
    color: '#e94560',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  poemPreview: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'serif',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
});
