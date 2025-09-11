// Contoh penggunaan Firestore
import { db } from "../config/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

// Contoh 1: Menambah data user
export async function addUser() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Akbar",
      email: "akbar@example.com",
      createdAt: new Date()
    });
    console.log("User berhasil ditambahkan dengan ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error: ", e);
    throw e;
  }
}

// Contoh 2: Menambah data project
export async function addProject() {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      title: "Portfolio Website",
      description: "Website portfolio menggunakan React dan Firebase",
      technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
      status: "completed",
      createdAt: new Date()
    });
    console.log("Project berhasil ditambahkan dengan ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error: ", e);
    throw e;
  }
}

// Contoh 3: Mengambil semua data users
export async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    console.log("Users:", users);
    return users;
  } catch (e) {
    console.error("Error: ", e);
    throw e;
  }
}

// Contoh 4: Update data user
export async function updateUser(userId: string, newData: any) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...newData,
      updatedAt: new Date()
    });
    console.log("User berhasil diupdate");
  } catch (e) {
    console.error("Error: ", e);
    throw e;
  }
}

// Contoh 5: Hapus data user
export async function deleteUser(userId: string) {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.log("User berhasil dihapus");
  } catch (e) {
    console.error("Error: ", e);
    throw e;
  }
}

// Fungsi untuk menjalankan semua contoh
export async function runAllExamples() {
  console.log("=== Menjalankan Contoh Firestore ===");
  
  try {
    // 1. Tambah user
    console.log("1. Menambah user...");
    const userId = await addUser();
    
    // 2. Tambah project
    console.log("2. Menambah project...");
    await addProject();
    
    // 3. Ambil semua users
    console.log("3. Mengambil semua users...");
    await getUsers();
    
    // 4. Update user
    console.log("4. Update user...");
    await updateUser(userId, { name: "Akbar Updated" });
    
    // 5. Ambil users lagi untuk melihat perubahan
    console.log("5. Mengambil users setelah update...");
    await getUsers();
    
    console.log("=== Semua contoh berhasil dijalankan ===");
  } catch (error) {
    console.error("Error menjalankan contoh:", error);
  }
}

// Export untuk digunakan di console browser
// Jalankan: runAllExamples() di console browser untuk test
(window as any).firestoreExamples = {
  addUser,
  addProject,
  getUsers,
  updateUser,
  deleteUser,
  runAllExamples
};
