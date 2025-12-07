import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Sparkles,
  Wand2,
  BookOpen,
  Mic,
  Palette,
  RefreshCw,
  FileText,
} from 'lucide-react-native';
import { aiService } from '../../lib/ai-service';

export default function AIToolsScreen() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const aiTools = [
    {
      id: 'generate',
      title: 'Poem Generator',
      description: 'Create beautiful poems from your ideas',
      icon: Sparkles,
      color: '#e94560',
    },
    {
      id: 'compare',
      title: 'Poem Comparator',
      description: 'Compare two poems in detail',
      icon: BookOpen,
      color: '#0f3460',
    },
    {
      id: 'meaning',
      title: 'Word Meaning',
      description: 'Find meanings and synonyms',
      icon: FileText,
      color: '#16213e',
    },
    {
      id: 'interpret',
      title: 'Theme Interpreter',
      description: 'Understand poem themes deeply',
      icon: Wand2,
      color: '#533483',
    },
    {
      id: 'recite',
      title: 'AI Reciter',
      description: 'Listen to poems in different tones',
      icon: Mic,
      color: '#e94560',
    },
    {
      id: 'rewrite',
      title: 'Poem Rewriter',
      description: 'Rewrite in different styles',
      icon: RefreshCw,
      color: '#0f3460',
    },
    {
      id: 'artwork',
      title: 'Artwork Generator',
      description: 'Create art from poem themes',
      icon: Palette,
      color: '#16213e',
    },
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setInput('');
    setResult('');
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      switch (selectedTool) {
        case 'generate':
          const poem = await aiService.generatePoem({
            topic: input,
            style: 'modern',
            form: 'free-verse',
          });
          setResult(poem);
          break;
        case 'meaning':
          const meaning = await aiService.getWordMeaning(input);
          setResult(JSON.stringify(meaning, null, 2));
          break;
        case 'interpret':
          const interpretation = await aiService.interpretTheme(input);
          setResult(JSON.stringify(interpretation, null, 2));
          break;
        case 'rewrite':
          const rewritten = await aiService.rewritePoem(input, 'romantic');
          setResult(rewritten);
          break;
        default:
          setResult('This feature is coming soon!');
      }
    } catch (error) {
      setResult('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a0a2e', '#16213e']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Tools</Text>
        <Text style={styles.headerSubtitle}>Powered by advanced AI</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.toolsGrid}>
          {aiTools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => handleToolSelect(tool.id)}
            >
              <LinearGradient
                colors={[`${tool.color}20`, `${tool.color}10`]}
                style={styles.toolGradient}
              >
                <tool.icon size={32} color={tool.color} />
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedTool !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['#1a0a2e', '#16213e']}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>
              {aiTools.find((t) => t.id === selectedTool)?.title}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your text here..."
              placeholderTextColor="#999"
              value={input}
              onChangeText={setInput}
              multiline
            />

            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerate}
              disabled={loading}
            >
              <Text style={styles.generateButtonText}>
                {loading ? 'Processing...' : 'Generate'}
              </Text>
            </TouchableOpacity>

            {result ? (
              <ScrollView style={styles.resultContainer}>
                <Text style={styles.resultText}>{result}</Text>
              </ScrollView>
            ) : null}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedTool(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
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
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  toolCard: {
    width: '48%',
    margin: '1%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  toolGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    borderRadius: 16,
    minHeight: 150,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 6,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  generateButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    maxHeight: 200,
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#e94560',
    fontSize: 16,
  },
});
