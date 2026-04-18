<template>
  <v-container class="ai-concierge-page py-6" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">

        <!-- Header -->
        <div class="d-flex align-center mb-4">
          <div>
            <div class="text-h5 font-weight-bold">AI Concierge</div>
            <div class="text-caption text-grey">Discover movies with natural language</div>
          </div>
        </div>

        <!-- Chat container -->
        <v-card class="chat-card" min-height="500" max-height="600">
          <v-card-text class="chat-messages pa-0" ref="messagesContainer">
            <!-- Welcome -->
            <div v-if="messages.length === 0" class="welcome-state pa-8 text-center">
              <v-icon icon="mdi-robot" size="64" color="primary" class="mb-4" />
              <div class="text-h6 mb-2">Ask me anything about movies</div>
              <div class="text-body-2 text-grey mb-4">
                I can recommend films, compare titles, suggest similar movies, and more
              </div>
              <div class="d-flex flex-wrap ga-2 justify-center">
                <v-chip
                  v-for="suggestion in suggestions"
                  :key="suggestion"
                  variant="outlined"
                  size="small"
                  @click="sendSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </v-chip>
              </div>
            </div>

            <!-- Messages -->
            <div v-else class="messages-list pa-4">
              <div
                v-for="(msg, i) in messages"
                :key="i"
                :class="['message-wrapper', msg.role === 'user' ? 'user-msg' : 'ai-msg']"
              >
                <v-avatar v-if="msg.role === 'assistant'" size="28" color="primary" class="mr-2">
                  <v-icon icon="mdi-robot" size="small" />
                </v-avatar>
                <div class="message-bubble">
                  <div class="text-body-2" style="white-space: pre-wrap">{{ msg.content }}</div>
                </div>
                <v-avatar v-if="msg.role === 'user'" size="28" color="grey-darken-1" class="ml-2">
                  <v-icon icon="mdi-account" size="small" />
                </v-avatar>
              </div>

              <!-- Typing indicator -->
              <div v-if="loading" class="ai-msg">
                <v-avatar size="28" color="primary" class="mr-2">
                  <v-icon icon="mdi-robot" size="small" />
                </v-avatar>
                <div class="message-bubble">
                  <div class="d-flex align-center ga-1">
                    <v-icon icon="mdi-loading" size="small" class="spin" />
                    <span class="text-caption text-grey">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>

          <!-- Input -->
          <v-divider />
          <v-card-text class="pa-3">
            <div class="d-flex ga-2">
              <v-text-field
                v-model="inputMessage"
                placeholder="Ask me about movies..."
                variant="outlined"
                density="compact"
                hide-details
                :disabled="loading"
                @keyup.enter="sendMessage"
              />
              <v-btn
                icon="mdi-send"
                color="primary"
                :loading="loading"
                :disabled="!inputMessage.trim()"
                @click="sendMessage"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useMetaTags } from '@/composables/useMetaTags'
import { useAIService } from '@/api/services/aiService'

const { loading, sendChat } = useAIService()
const { setPageMeta } = useMetaTags()

const messages = ref([])
const inputMessage = ref('')
const messagesContainer = ref(null)

onMounted(() => {
  setPageMeta({ title: 'AI Concierge', description: 'Your AI-powered movie and TV assistant. Get personalized recommendations, detailed info, and smart collections.' })
})

const suggestions = [
  '🎬 Movies like Inception',
  '🌊 Best documentaries of 2024',
  '😂 Comedies for a rainy night',
  '⚡ Action movies this decade',
  '🎭 Films similar to Whiplash',
]

const sendMessage = async () => {
  const text = inputMessage.value.trim()
  if (!text || loading.value) return

  // Add user message
  messages.value.push({ role: 'user', content: text })
  inputMessage.value = ''
  await scrollToBottom()

  try {
    const reply = await sendChat({ message: text, language: 'es' })
    messages.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, I had trouble connecting. Please try again.',
    })
  }

  await scrollToBottom()
}

const sendSuggestion = async (text) => {
  inputMessage.value = text.replace(/^[^\s]+\s/, '')  // strip emoji
  await sendMessage()
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value?.$el) {
    messagesContainer.value.$el.scrollTop = messagesContainer.value.$el.scrollHeight
  }
}
</script>

<style scoped>
.ai-concierge-page {
  background: rgba(0, 0, 0, 0.2);
}

.chat-card {
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  max-height: 540px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
}

.user-msg {
  flex-direction: row-reverse;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
}

.user-msg .message-bubble {
  background: rgba(var(--v-theme-primary), 0.2);
}

.ai-msg {
  flex-direction: row;
}

.welcome-state {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
