import firebaseConfig from "../firebase-applet-config.json";

// We will export a clean DB and Auth interface that falls back to a custom Sandbox simulation 
// if live Firebase connections aren't provisioned or run offline.
export interface LocalDBInstance {
  collection: (name: string) => {
    get: () => Promise<any[]>;
    add: (doc: any) => Promise<any>;
    update: (id: string, doc: any) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
}

class SandboxDatabase {
  private getStorageKey(collection: string) {
    return `scamshield_fs_${collection}`;
  }

  private getData(collection: string): any[] {
    const raw = localStorage.getItem(this.getStorageKey(collection));
    return raw ? JSON.parse(raw) : [];
  }

  private setData(collection: string, data: any[]) {
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(data));
  }

  async getDocs(collectionName: string): Promise<any[]> {
    return this.getData(collectionName);
  }

  async addDoc(collectionName: string, docData: any): Promise<any> {
    const data = this.getData(collectionName);
    const newDoc = {
      id: "sh-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      ...docData,
    };
    data.unshift(newDoc);
    this.setData(collectionName, data);
    return newDoc;
  }

  async setDoc(collectionName: string, docId: string, docData: any): Promise<void> {
    const data = this.getData(collectionName);
    const existingIndex = data.findIndex((d) => d.id === docId);
    if (existingIndex > -1) {
      data[existingIndex] = { ...data[existingIndex], ...docData, updatedAt: new Date().toISOString() };
    } else {
      data.push({ id: docId, createdAt: new Date().toISOString(), ...docData });
    }
    this.setData(collectionName, data);
  }

  async getDoc(collectionName: string, docId: string): Promise<any | null> {
    const data = this.getData(collectionName);
    return data.find((d) => d.id === docId) || null;
  }

  async updateDoc(collectionName: string, docId: string, docData: any): Promise<void> {
    const data = this.getData(collectionName);
    const index = data.findIndex((d) => d.id === docId);
    if (index > -1) {
      data[index] = { ...data[index], ...docData, updatedAt: new Date().toISOString() };
      this.setData(collectionName, data);
    }
  }

  async deleteDoc(collectionName: string, docId: string): Promise<void> {
    const data = this.getData(collectionName);
    const filtered = data.filter((d) => d.id !== docId);
    this.setData(collectionName, filtered);
  }
}

// Simulated authentication state
class SandboxAuth {
  private userKey = "scamshield_current_user";

  getCurrentUser() {
    const parsed = localStorage.getItem(this.userKey);
    return parsed ? JSON.parse(parsed) : null;
  }

  signIn(email: string, displayName: string, role: "user" | "admin" = "user") {
    const user = {
      uid: "usr-" + Math.random().toString(36).substr(2, 9),
      email,
      displayName: displayName || email.split("@")[0],
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      role,
      cyberSafetyScoreList: [78, 84, 92],
      registeredAt: new Date().toISOString(),
      scansCount: 4,
    };
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return user;
  }

  signOut() {
    localStorage.removeItem(this.userKey);
  }
}

export const sandboxDB = new SandboxDatabase();
export const sandboxAuth = new SandboxAuth();

export const isFirebaseConfigured = !firebaseConfig.isPlaceholder;
export const configDetails = firebaseConfig;
