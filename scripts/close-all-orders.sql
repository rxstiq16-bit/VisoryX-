UPDATE public.orders
SET status = 'completed',
    actual_completion = now(),
    updated_at = now()
WHERE status NOT IN ('completed', 'delivered', 'cancelled');
