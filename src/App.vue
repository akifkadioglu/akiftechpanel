<template>
  <div class="space-y-5 mt-5 container mx-auto">
    <div class="flex justify-center">
      <input
        type="text"
        class="bg-gray-50 w-96 border focus:outline-none focus:border-gray-500 border-gray-300 text-gray-900 text-sm rounded-0 p-2.5"
        placeholder="Reference ID"
        v-model="replyID"
      />
    </div>
    <div class="flex justify-center">
      <input
        type="text"
        class="bg-gray-50 w-96 border focus:outline-none focus:border-gray-500 border-gray-300 text-gray-900 text-sm rounded-0 p-2.5"
        placeholder="Title"
        v-model="title"
      />
    </div>
    <div class="flex justify-center">
      <input
        type="text"
        class="bg-gray-50 w-96 border focus:outline-none focus:border-gray-500 border-gray-300 text-gray-900 text-sm rounded-0 p-2.5"
        placeholder="Subtitle"
        v-model="subtitle"
      />
    </div>

    <div class="prose mx-auto">
      <ckeditor :editor="editor" v-model="post" :config="editorConfig" />
    </div>
    <div class="flex justify-center">
      <transition name="fade" mode="out-in">
        <button
          v-if="!isLoading"
          @click="createData"
          class="rounded-full w-48 border px-3 py-1 hover:bg-zinc-800 hover:text-white text-lg font-semibold"
        >
          Send
        </button>
        <div v-else class="loading-spinner" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useFirestore } from "vuefire";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref } from "vue";
const editor = ClassicEditor;
const editorConfig = {};

const title = ref("");
const subtitle = ref("");
const replyID = ref("");
const post = ref("");
const isLoading = ref(false);

const db = useFirestore();

async function createData() {
  isLoading.value = true;
  var documentRef = "";
  if (replyID.value != "") {
    var documentRef = doc(db, "posts", replyID.value);
  }

  await addDoc(collection(db, "posts"), {
    title: title.value,
    subtitle: subtitle.value,
    reply: documentRef,
    post: post.value,
    created_at: serverTimestamp(),
  })
    .then(() => {
      title.value = "";
      subtitle.value = "";
      replyID.value = "";
      post.value = "";
    })
    .catch(() => {});
  isLoading.value = false;
}
</script>

<style scoped></style>
