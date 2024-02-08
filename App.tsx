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

// const handleDeleteNoteConfirmation = (noteId :any) => {
//   Alert.alert(
//     "Confirmation",
//     "Êtes-vous sûr de vouloir supprimer cette note ?",
//     [
//       {
//         text: "Non",
//         style: "cancel"
//       },
//       { text: "Oui", onPress: () => handleDeleteNote(noteId) }
//     ]
//   );
// };

// const handleDeleteNote = (noteId :any) => {
//   // Logique pour supprimer la note
//   console.log("Suppression de la note avec l'ID:", noteId);
//   // Mettez à jour l'état de vos notes ici
// };

 
 const syncData = () => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      console.log("Connexion : ", state.isConnected);
      // Logique Api
      console.log("Synchronisation des notes avec l'API");
    } else {
      console.log("Il n'y a pas encore de connaxion : ", state.isConnected);
    }
  });
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

   // Vérification périodique de la connexion Internet pour synchroniser les datas
   const intervalId = setInterval(syncData, 10000); // Vérifiez toutes les 10 secondes

   // Nettoyage de l'intervalle lors du démontage du composant
   return () => clearInterval(intervalId);
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
       renderItem={({ item }) => <Text style={{ padding: 10 }}>{item}</Text>}
     />
   </View>
  );
 };

 export default App;