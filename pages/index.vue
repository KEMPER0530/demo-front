<template>
  <div class="m-auto flex justify-center min-h-screen items-center text-center bg-black">
      <div>
        <div class="flex flex-col">
          <nuxt-link
            to="/inquiry"
            type="button"
            class="py-4 px-8 mt-8 text-2xl text-gray-50 bg-green-500 hover:bg-green-600 focus:ring-green-600 focus:ring-offset-green-600 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          >
            メール送信機能
          </nuxt-link>
          <nuxt-link
            to="/search"
            type="button"
            class="py-4 px-8 mt-8 text-2xl text-gray-50 bg-yellow-400 hover:bg-yellow-600 focus:ring-yellow-600 focus:ring-offset-yellow-600 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          ><i class="el-icon-search"></i>
            Qiita記事
          </nuxt-link>
          <nuxt-link
            to="/gpt"
            type="button"
            class="py-4 px-8 mt-8 text-2xl text-gray-50 bg-blue-400 hover:bg-blue-600 focus:ring-blue-600 focus:ring-offset-blue-600 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full"
          ><i class="el-icon-search"></i>
            ChatGpt
          </nuxt-link>
          <button class="py-4 px-8 mt-8 text-2xl text-gray-50 bg-red-500 hover:bg-red-600 focus:ring-red-600 focus:ring-offset-red-600 text-white transition ease-in duration-200 text-center font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full" @click.prevent="$auth.logout()">Logout</button>
        </div>
      </div>
  </div>
</template>
