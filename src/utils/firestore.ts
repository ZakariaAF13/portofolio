import { db } from "../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";

// Interface untuk data user
export interface User {
  id?: string;
  name: string;
  email: string;
  createdAt?: Date;
}

// Interface untuk data contact message
export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
  status?: 'unread' | 'read' | 'replied';
}

// Fungsi untuk menambah user
export async function addUser(userData: Omit<User, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: new Date()
    });
    console.log("User berhasil ditambahkan dengan ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error menambah user: ", error);
    throw error;
  }
}

// Fungsi untuk menambah pesan contact
export async function addContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) {
  try {
    const docRef = await addDoc(collection(db, "contact_messages"), {
      ...messageData,
      createdAt: new Date(),
      status: 'unread'
    });
    console.log("Pesan contact berhasil ditambahkan dengan ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error menambah pesan contact: ", error);
    throw error;
  }
}

// Fungsi untuk mengambil semua users
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });
    return users;
  } catch (error) {
    console.error("Error mengambil users: ", error);
    throw error;
  }
}

// Fungsi untuk mengambil pesan contact
export async function getContactMessages(limitCount: number = 50) {
  try {
    const q = query(
      collection(db, "contact_messages"), 
      orderBy("createdAt", "desc"), 
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const messages: ContactMessage[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as ContactMessage);
    });
    return messages;
  } catch (error) {
    console.error("Error mengambil pesan contact: ", error);
    throw error;
  }
}

// Fungsi untuk update status pesan contact
export async function updateContactMessageStatus(messageId: string, status: 'unread' | 'read' | 'replied') {
  try {
    const messageRef = doc(db, "contact_messages", messageId);
    await updateDoc(messageRef, {
      status: status
    });
    console.log("Status pesan berhasil diupdate");
  } catch (error) {
    console.error("Error update status pesan: ", error);
    throw error;
  }
}

// Fungsi untuk menghapus user
export async function deleteUser(userId: string) {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("User berhasil dihapus");
  } catch (error) {
    console.error("Error menghapus user: ", error);
    throw error;
  }
}

// Contoh penggunaan
export const firestoreExamples = {
  // Contoh menambah user
  addUserExample: async () => {
    try {
      await addUser({
        name: "Akbar",
        email: "akbar@example.com"
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  // Contoh menambah pesan contact
  addContactExample: async () => {
    try {
      await addContactMessage({
        name: "John Doe",
        email: "john@example.com",
        subject: "Pertanyaan tentang portfolio",
        message: "Halo, saya tertarik dengan project Anda..."
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  },

  // Contoh mengambil data
  getDataExample: async () => {
    try {
      const users = await getAllUsers();
      console.log("Users:", users);
      
      const messages = await getContactMessages(10);
      console.log("Contact Messages:", messages);
    } catch (error) {
      console.error("Error: ", error);
    }
  }
};
