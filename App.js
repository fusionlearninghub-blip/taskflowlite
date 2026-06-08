import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const STORAGE_KEY = '@task-flow/tasks';

function createTask(title) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export default function App() {
  const [taskTitle, setTaskTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        Alert.alert('Task Flow', 'Your saved tasks could not be loaded.');
      } finally {
        setIsReady(true);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {
      Alert.alert('Task Flow', 'Your latest changes could not be saved.');
    });
  }, [isReady, tasks]);

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  const activeCount = tasks.length - completedCount;

  function addTask() {
    const cleanTitle = taskTitle.trim();
    if (!cleanTitle) {
      return;
    }

    setTasks((currentTasks) => [createTask(cleanTitle), ...currentTasks]);
    setTaskTitle('');
    Keyboard.dismiss();
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  function clearCompletedTasks() {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View>
              <Text style={styles.appName}>Task Flow</Text>
              <Text style={styles.subtitle}>Plan the day. Keep the flow.</Text>
            </View>
            <View style={styles.flashBadge}>
              <Ionicons name="flash" size={22} color="#ffe46b" />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{activeCount}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              accessibilityLabel="New task"
              onChangeText={setTaskTitle}
              onSubmitEditing={addTask}
              placeholder="Add a task"
              placeholderTextColor="#7b8496"
              returnKeyType="done"
              style={styles.input}
              value={taskTitle}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add task"
              onPress={addTask}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Ionicons name="add" size={26} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Today</Text>
            {completedCount > 0 ? (
              <Pressable onPress={clearCompletedTasks} hitSlop={10}>
                <Text style={styles.clearText}>Clear done</Text>
              </Pressable>
            ) : null}
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="sparkles" size={28} color="#1787ff" />
                </View>
                <Text style={styles.emptyTitle}>No tasks yet</Text>
                <Text style={styles.emptyText}>
                  Add your first task and build a little momentum.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Pressable
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.completed }}
                  onPress={() => toggleTask(item.id)}
                  style={[
                    styles.checkCircle,
                    item.completed && styles.checkCircleDone,
                  ]}
                >
                  {item.completed ? (
                    <Ionicons name="checkmark" size={18} color="#ffffff" />
                  ) : null}
                </Pressable>
                <Pressable
                  onPress={() => toggleTask(item.id)}
                  style={styles.taskTextButton}
                >
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.taskTextDone,
                    ]}
                  >
                    {item.title}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.title}`}
                  onPress={() => deleteTask(item.id)}
                  hitSlop={10}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#9aa3b5" />
                </Pressable>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            style={styles.taskList}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fbff',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  appName: {
    color: '#101828',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#667085',
    fontSize: 15,
    marginTop: 4,
  },
  flashBadge: {
    alignItems: 'center',
    backgroundColor: '#1787ff',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    shadowColor: '#1787ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    width: 48,
  },
  statsRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7edf5',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    paddingVertical: 16,
  },
  statBlock: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#101828',
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    color: '#667085',
    fontSize: 13,
    marginTop: 2,
  },
  statDivider: {
    backgroundColor: '#e7edf5',
    height: 34,
    width: 1,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d8e0ec',
    borderRadius: 8,
    borderWidth: 1,
    color: '#101828',
    flex: 1,
    fontSize: 17,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#1787ff',
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  pressedButton: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '800',
  },
  clearText: {
    color: '#1787ff',
    fontSize: 14,
    fontWeight: '700',
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7edf5',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 62,
    paddingHorizontal: 14,
  },
  checkCircle: {
    alignItems: 'center',
    borderColor: '#b8c2d4',
    borderRadius: 14,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  checkCircleDone: {
    backgroundColor: '#18a058',
    borderColor: '#18a058',
  },
  taskTextButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  taskText: {
    color: '#182230',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  taskTextDone: {
    color: '#98a2b3',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 38,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 74,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: '#eaf4ff',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 16,
    width: 56,
  },
  emptyTitle: {
    color: '#101828',
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    color: '#667085',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 260,
    textAlign: 'center',
  },
});
