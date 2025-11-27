<template>
  <footer class="bg-zinc-950 text-white mt-16">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div>
          <h3 class="text-xl font-bold mb-4">3D Electronics</h3>
          <p class="text-zinc-400 text-sm mb-4">
            Ваш надежный поставщик качественной электроники и комплектующих
          </p>
          <div class="flex gap-4">
            <a href="#" class="w-10 h-10 bg-zinc-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-zinc-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a href="#" class="w-10 h-10 bg-zinc-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Catalog -->
        <div>
          <h4 class="text-lg font-bold mb-4">Каталог</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li><nuxt-link to="/catalog/smartphones" class="hover:text-orange-500 transition-colors">Смартфоны</nuxt-link></li>
            <li><nuxt-link to="/catalog/laptops" class="hover:text-orange-500 transition-colors">Ноутбуки</nuxt-link></li>
            <li><nuxt-link to="/catalog/accessories" class="hover:text-orange-500 transition-colors">Аксессуары</nuxt-link></li>
            <li><nuxt-link to="/catalog/audio" class="hover:text-orange-500 transition-colors">Аудиотехника</nuxt-link></li>
            <li><nuxt-link to="/catalog/components" class="hover:text-orange-500 transition-colors">Комплектующие</nuxt-link></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h4 class="text-lg font-bold mb-4">Покупателям</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li><nuxt-link to="/delivery" class="hover:text-orange-500 transition-colors">Доставка и оплата</nuxt-link></li>
            <li><nuxt-link to="/warranty" class="hover:text-orange-500 transition-colors">Гарантия</nuxt-link></li>
            <li><nuxt-link to="/return" class="hover:text-orange-500 transition-colors">Возврат товара</nuxt-link></li>
            <li><nuxt-link to="/faq" class="hover:text-orange-500 transition-colors">Вопросы и ответы</nuxt-link></li>
            <li><nuxt-link to="/contacts" class="hover:text-orange-500 transition-colors">Контакты</nuxt-link></li>
          </ul>
        </div>

        <!-- Contacts -->
        <div>
          <h4 class="text-lg font-bold mb-4">Контакты</h4>
          <ul class="space-y-3 text-sm text-zinc-400">
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <div>
                <a href="tel:+71234567890" class="hover:text-orange-500 transition-colors">+7 (123) 456-78-90</a>
                <p class="text-xs text-zinc-500 mt-1">Пн-Пт: 9:00 - 20:00</p>
              </div>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:info@3delectronics.com" class="hover:text-orange-500 transition-colors">info@3delectronics.com</a>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>г. Москва, ул. Примерная, д. 123</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-zinc-800 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-zinc-500">
            © 2025 3D Electronics. Все права защищены.
          </p>
          <div class="flex flex-wrap gap-6 text-sm text-zinc-500">
            <nuxt-link to="/privacy" class="hover:text-orange-500 transition-colors">Политика конфиденциальности</nuxt-link>
            <nuxt-link to="/terms" class="hover:text-orange-500 transition-colors">Пользовательское соглашение</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
