<template>
  <div class="space-y-5 mt-5 mx-auto">
    <div class="flex justify-center">
      <select
        v-model="groupID"
        id="countries"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-gray-500 block w-96 p-2.5"
      >
        <option value="" selected>Not Selected</option>
        <option :value="item.id" v-for="(item, index) in groups" :key="index">
          {{ item.title }}
        </option>
      </select>
    </div>
    <div class="flex justify-center">
      <input
        type="text"
        class="bg-gray-50 w-96 border focus:outline-none focus:border-gray-500 border-gray-300 text-gray-900 text-sm rounded-0 p-2.5"
        placeholder="Reply ID"
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
import { useFirestore, useCollection } from "vuefire";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref } from "vue";
const editor = ClassicEditor;
const editorConfig = {
  mediaEmbed: {
    previewsInData: true,
  },
};
const title = ref("");
const subtitle = ref("");
const replyID = ref("");
const post = ref("");
const groupID = ref("");
const isLoading = ref(false);
const db = useFirestore();
const groups = useCollection(collection(db, "groups"));
const body = new Map();

async function createData() {
  isLoading.value = true;

  body.set("title", title.value);
  body.set("subtitle", subtitle.value);
  body.set("post", post.value);
  body.set("created_at", serverTimestamp());

  if (replyID.value != "") {
    body.set("reply", doc(db, "posts", replyID.value));
  }
  if (groupID.value != "") {
    body.set("group", doc(db, "groups", groupID.value));
  } else {
    body.delete("group");
  }

  await addDoc(collection(db, "posts"), Object.fromEntries(body))
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
