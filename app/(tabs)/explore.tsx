import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search } from 'lucide-react-native';
import { supabase, Category, Theme } from '../../lib/supabase';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, themesRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('themes').select('*'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (themesRes.data) setThemes(themesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search poems, authors, themes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <LinearGradient
                  colors={['rgba(233, 69, 96, 0.2)', 'rgba(15, 52, 96, 0.2)']}
                  style={styles.categoryGradient}
                >
                  <Text style={styles.categoryIcon}>{category.icon || '📚'}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Themes</Text>
          <View style={styles.themesGrid}>
            {themes.map((theme) => (
              <TouchableOpacity key={theme.id} style={styles.themeCard}>
                <Text style={styles.themeName}>{theme.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Tags</Text>
          <View style={styles.tagsContainer}>
            {['love', 'nature', 'life', 'hope', 'dreams', 'soul'].map((tag) => (
              <TouchableOpacity key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  categoryCard: {
    marginLeft: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
    width: 120,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    borderRadius: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  themeCard: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  themeName: {
    color: '#fff',
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  tag: {
    backgroundColor: 'rgba(15, 52, 96, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 5,
  },
  tagText: {
    color: '#e94560',
    fontSize: 14,
  },
});
