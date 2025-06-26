
-- Create a table for vacation plans
CREATE TABLE public.vacation_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  starting_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
  budget DECIMAL(10,2) NOT NULL CHECK (budget > 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own vacation plans
ALTER TABLE public.vacation_plans ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own vacation plans
CREATE POLICY "Users can view their own vacation plans" 
  ON public.vacation_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own vacation plans
CREATE POLICY "Users can create their own vacation plans" 
  ON public.vacation_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own vacation plans
CREATE POLICY "Users can update their own vacation plans" 
  ON public.vacation_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own vacation plans
CREATE POLICY "Users can delete their own vacation plans" 
  ON public.vacation_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);
