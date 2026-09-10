import.meta.glob(['./basic/**/*.{ts,tsx}', '!./basic/**/*.{test,spec}.{ts,tsx}'], { eager: true });
import.meta.glob(['./advanced/**/*.{ts,tsx}', '!./advanced/**/*.{test,spec}.{ts,tsx}'], {
  eager: true,
});
import.meta.glob(['./XIT/**/*.{ts,tsx}', '!./XIT/**/*.{test,spec}.{ts,tsx}'], { eager: true });
