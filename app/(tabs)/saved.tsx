import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase, Poem } from '../../lib/supabase';
import { Heart, Bookmark, Folder } from 'lucide-react-native';

export default function SavedScreen() {
  const router = useRouter();
  const [bookmarkedPoems, setBookmarkedPoems] = useState<Poem[]>([]);
  const [likedPoems, setLikedPoems] = useState<Poem[]>([]);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'likes'>('bookmarks');

  useEffect(() => {
    loadSavedPoems();
  }, []);

  const loadSavedPoems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load bookmarked poems
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('poem_id, poems(*)')
        .eq('user_id', user.id);

      if (bookmarks) {
        setBookmarkedPoems(bookmarks.map((b: any) => b.poems));
      }

      // Load liked poems
      const { data: likes } = await supabase
        .from('likes')
        .select('poem_id, poems(*)')
        .eq('user_id', user.id);

      if (likes) {
        setLikedPoems(likes.map((l: any) => l.poems));
      }
    } catch (error) {
      console.error('Error loading saved poems:', error);
    }
  };

  const poems = activeTab === 'bookmarks' ? bookmarkedPoems : likedPoems;

  return (
    <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
            onPress={() => setActiveTab('bookmarks')}
          >
            <Bookmark size={20} color={activeTab === 'bookmarks' ? '#e94560' : '#999'} />
            <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
              Bookmarks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
            onPress={() => setActiveTab('likes')}
          >
            <Heart size={20} color={activeTab === 'likes' ? '#e94560' : '#999'} />
            <Text style={[styles.tabText, activeTab === 'likes' && styles.activeTabText]}>
              Liked
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {poems.length === 0 ? (
          <View style={styles.emptyState}>
            <Folder size={64} color="#666" />
            <Text style={styles.emptyText}>
              No {activeTab === 'bookmarks' ? 'bookmarked' : 'liked'} poems yet
            </Text>
          </View>
        ) : (
          poems.map((poem) => (
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
                <Text style={styles.poemPreview} numberOfLines={3}>
                  {poem.content}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
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
    marginBottom: 16,
    fontFamily: 'serif',
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#e94560',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
  poemCard: {
    marginHorizontal: 20,
    marginBottom: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'serif',
  },
  poemAuthor: {
    fontSize: 14,
    color: '#e94560',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  poemPreview: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
});
