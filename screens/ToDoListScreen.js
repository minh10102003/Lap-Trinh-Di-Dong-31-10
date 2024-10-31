import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const initialTasks = [
  { id: '1', icon: 'inbox', title: 'Inbox', count: 0, overdue: 0, tasks: [] },
  { id: '2', icon: 'heart', title: 'Habits', count: 0, overdue: 0, tasks: [] },
  { id: '3', icon: 'credit-card', title: 'Bills', count: 0, overdue: 0, tasks: [] },
  { id: '4', icon: 'shopping-cart', title: 'Shopping', count: 0, overdue: 0, tasks: [] },
  { id: '5', icon: 'car', title: 'Chores', count: 0, overdue: 0, tasks: [] },
  { id: '6', icon: 'film', title: 'Movies/Shows', count: 0, overdue: 0, tasks: [] },
  { id: '7', icon: 'graduation-cap', title: 'School', count: 0, overdue: 0, tasks: [] },
  { id: '8', icon: 'book', title: 'Math', count: 0, overdue: 0, tasks: [] },
];

export default function ToDoListScreen() {
  const [categories, setCategories] = useState(initialTasks);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  // Calculate total count and overdue
  const totalTasks = categories.reduce((total, task) => total + (task.count || 0), 0);
  const totalOverdue = categories.reduce((total, task) => total + (task.overdue || 0), 0);

  // Function to mark a regular task as completed
  const completeTask = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          const newCount = category.count > 0 ? category.count - 1 : 0;
          return {
            ...category,
            count: newCount,
          };
        }
        return category;
      })
    );
  };

  // Function to mark an overdue task as completed
  const completeOverdueTask = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === categoryId) {
          const newCount = category.count > 0 ? category.count - 1 : 0;
          const newOverdue = category.overdue > 0 ? category.overdue - 1 : 0;

          return {
            ...category,
            count: newCount,
            overdue: newOverdue,
          };
        }
        return category;
      })
    );
  };

  // Function to add a new task
  const addTask = () => {
    if (!newTaskTitle || !newTaskDeadline) {
      Alert.alert('Please fill in all fields');
      return;
    }

    const deadlineTime = new Date(newTaskDeadline).getTime();
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === selectedCategoryId) {
          const newTask = { title: newTaskTitle, deadline: deadlineTime };
          return {
            ...category,
            tasks: [...category.tasks, newTask],
            count: category.count + 1,
          };
        }
        return category;
      })
    );

    // Reset fields and close the modal
    setNewTaskTitle('');
    setNewTaskDeadline('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>Amanda</Text>
        <Text style={styles.points}>{totalTasks} tasks • {totalOverdue} overdue</Text>
        <Image 
          source={{ uri: 'https://snack.expo.dev/@minh03/93c818' }} 
          style={styles.avatar} 
        />
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.taskInfo}>
              <Icon name={item.icon} size={24} color="#4A90E2" />
              <Text style={styles.taskTitle}>{item.title}</Text>
            </View>
            <View style={styles.taskCountContainer}>
              <Text style={styles.taskCount}>{item.count || 0}</Text>
              <Text style={styles.overdueCount}>{item.overdue || 0}</Text>
              {item.count > 0 && (
                <TouchableOpacity onPress={() => completeTask(item.id)}>
                  <Text style={styles.completeButton}>Complete</Text>
                </TouchableOpacity>
              )}
              {item.overdue > 0 && (
                <TouchableOpacity onPress={() => completeOverdueTask(item.id)}>
                  <Text style={styles.completeButton}>Complete Overdue</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => { setSelectedCategoryId(item.id); setModalVisible(true); }}>
                <Text style={styles.addButton}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Deadline (YYYY-MM-DD)"
            value={newTaskDeadline}
            onChangeText={setNewTaskDeadline}
          />
          <Button title="Add Task" onPress={addTask} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Swipe up to see your day</Text>
        <Text style={styles.footerPrompt}>What do you need to remember?</Text>
        <Icon name="plus-circle" size={30} color="#4A90E2" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  points: {
    fontSize: 16,
    color: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    marginLeft: 10,
  },
  taskCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCount: {
    fontSize: 16,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 5,
  },
  overdueCount: {
    fontSize: 16,
    color: '#FF3B30',
    backgroundColor: '#FFD1D1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 5,
  },
  completeButton: {
    fontSize: 14,
    color: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButton: {
    fontSize: 14,
    color: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footer: {
    backgroundColor: '#F0F0F0',
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  footerPrompt: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: '#fff',
  },
});
