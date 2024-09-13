<script lang="ts">
  import { onMount } from 'svelte';
  import { initVisitorBlock, saveVisitorData } from '../services/visitorBlock';
  import type { VisitorData } from '../types';

  export let visitorData: VisitorData | null;

  onMount(async () => {
    await main();
  });

  async function main(): Promise<void> {
    try {
      if (visitorData) {
        saveVisitorData(visitorData);
        initVisitorBlock('#visitor-block');
      }
    } catch (err) {
      console.error(err);
    }
  }
</script>

<details open>
  <svg width="0" height="0" class="hidden">
    <svg
      id="copyIcon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"
      />
    </svg>
    <svg
      id="infoIcon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
      />
    </svg>
  </svg>

  <summary><h3>One of use case</h3></summary>
  <div id="visitor-block"></div>
</details>
