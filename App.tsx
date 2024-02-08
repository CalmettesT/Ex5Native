import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList, Alert } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import NetInfo from '@react-native-community/netinfo';


const App = () => {
 const [noteText, setNoteText] = useState('');
 const [notes, setNotes] = useState<string[]>([]);
 const storage = new MMKV();

 

 const handleAddNote = () => {
  // Ajouter la note dans MMKV et mettre à jour l'état
  const newNotes = [...notes, noteText];
  setNotes(newNotes);
  storage.set('notes', JSON.stringify(newNotes));
  setNoteText(''); // Réinitialiser le TextInput après l'ajout
};

// const handleDeleteNoteConfirmation = (noteId: any) => {
//   Alert.alert(
//     "Confirmation",
//     "Êtes-vous sûr de vouloir supprimer cette note ?",
//     [
//       { text: "Non", style: "cancel" },
//       { text: "Oui", onPress: () => handleDeleteNote(noteId) }
//     ]
//   );
// };

// const handleDeleteNote = (noteId: any) => {
//   // Logique pour supprimer la note
// };

 
const syncData = () => {
  console.log("Synchronisation des notes avec l'API");
  // Ajouter logique d'envoi des notes à l'API ici
};

  useEffect(() => {
    // Charger les notes depuis MMKV au démarrage de l'application
    const loadNotes = () => {
      const savedNotes = storage.getString('notes');
      if (savedNotes) {
        const notesArray = JSON.parse(savedNotes);
        setNotes(notesArray);
      }
    };
 
    loadNotes();

   // Écoute les changements d'état de la connexion
   const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      console.log("Connecté");
      syncData(); // Synchronisez les données seulement quand l'état passe à connecté
    } else {
      console.log("Pas de connexion");
    }
  });

  return () => unsubscribe();
  }, []);


  return (
  // Interface utilisateur pour ajouter et afficher les notes
  <View>
      <TextInput
        placeholder="Écrivez votre note ici"
        value={noteText}
        onChangeText={setNoteText}
      />
      <Button title="Ajouter une note" onPress={handleAddNote} />
      <FlatList
        data={notes}
        keyExtractor={(item, index) => 'note-' + index}
        renderItem={({ item }) => (
          <Text style={{ padding: 3 }}>{item}</Text>
        )}
      />
    </View>
  );
 };

 export default App;