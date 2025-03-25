 <script>
     // src/lib/MenuItem.svelte
     import { onMount } from 'svelte';
     export let item;
     export let catalog; // Передаем весь каталог для поиска родителей
     export let level = 1; // Уровень вложенности, начиная с 1
 
     // Максимальный уровень вложенности
     const MAX_LEVEL = 3;
 
     // Функция для построения полного пути (можно вынести в утилиту, если используется в нескольких местах)
     function getFullPath(item, items) {
         const segments = [];
         let current = item;
         while (current) {
             segments.unshift(current.slug);
             current = items.find(i => i.id === current.parent_id);
         }
         return segments.join('/');
     }
 
     // Состояние для отслеживания открытия/закрытия подменю
     let isOpen = false;
     let hasChildren = item.children && item.children.length > 0 && level < MAX_LEVEL;
     
     function handleClick(event) {
         if (hasChildren && level === 1) {
             // Для первого уровня с детьми - переключаем подменю
             isOpen = !isOpen;
             // Предотвращаем переход по ссылке только если есть дочерние элементы
             event.preventDefault();
         }
         // Для элементов без детей или не первого уровня - обычное поведение ссылки
     }
     
     // Обработчики для мобильного меню
     function handleTouchStart(event) {
         if (hasChildren) {
             event.preventDefault();
             isOpen = !isOpen;
         }
     }
 </script>
 
 <div class="menu-item relative {level === 1 ? 'top-level' : ''}" class:has-children={hasChildren}>
     {#if level === 1}
         <!-- Элементы первого уровня (горизонтальное меню) -->
         <a
             href={`/${getFullPath(item, catalog)}`}
             class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium flex items-center"
             on:click={handleClick}
             on:touchstart={handleTouchStart}
         >
             {item.pagetitle}
             {#if hasChildren}
                 <span class="ml-1">▼</span>
             {/if}
         </a>
         
         {#if hasChildren}
             <div class="dropdown-menu absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 {isOpen ? 'block' : 'hidden'} hover-target">
                 {#each item.children as child}
                     <svelte:self item={child} catalog={catalog} level={level + 1} />
                 {/each}
             </div>
         {/if}
     {:else}
         <!-- Элементы подменю (вертикальное меню) -->
         <a
             href={`/${getFullPath(item, catalog)}`}
             class="submenu-item block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center"
             on:click={handleClick}
             on:touchstart={handleTouchStart}
         >
             <span>{item.pagetitle}</span>
             {#if hasChildren}
                 <span>▶</span>
             {/if}
         </a>
         
         {#if hasChildren}
             <div class="dropdown-submenu absolute left-full top-0 w-48 bg-white rounded-md shadow-lg py-1 {isOpen ? 'block' : 'hidden'} hover-target">
                 {#each item.children as child}
                     <svelte:self item={child} catalog={catalog} level={level + 1} />
                 {/each}
             </div>
         {/if}
     {/if}
 </div>
 
 <style>
     /* Стили для отображения подменю при наведении */
     .top-level:hover > .hover-target,
     .submenu-item:hover + .hover-target,
     .hover-target:hover {
         display: block !important;
     }
     
     /* Добавляем отступ для предотвращения исчезновения при перемещении курсора */
     .dropdown-menu::before {
         content: '';
         position: absolute;
         top: -10px;
         left: 0;
         width: 100%;
         height: 10px;
     }
     
     .dropdown-submenu::before {
         content: '';
         position: absolute;
         left: -10px;
         top: 0;
         width: 10px;
         height: 100%;
     }
 </style>