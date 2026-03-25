-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  organization TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create mining areas table
CREATE TABLE public.mining_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  location_name TEXT,
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  zoom_level INTEGER DEFAULT 12,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create approved boundaries (legal mining zones)
CREATE TABLE public.approved_boundaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mining_area_id UUID REFERENCES public.mining_areas(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  boundary_geojson JSONB NOT NULL,
  license_number TEXT,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create detection results table
CREATE TABLE public.detection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mining_area_id UUID REFERENCES public.mining_areas(id) ON DELETE CASCADE NOT NULL,
  detection_date DATE NOT NULL,
  detected_boundaries JSONB NOT NULL,
  total_detected_area DOUBLE PRECISION,
  legal_area DOUBLE PRECISION,
  illegal_area DOUBLE PRECISION,
  illegal_zones JSONB,
  confidence_score DOUBLE PRECISION,
  processing_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mining_area_id UUID REFERENCES public.mining_areas(id) ON DELETE CASCADE NOT NULL,
  detection_result_id UUID REFERENCES public.detection_results(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL DEFAULT 'illegal_mining',
  severity TEXT NOT NULL DEFAULT 'high',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  location_description TEXT,
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create processing jobs for status tracking
CREATE TABLE public.processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mining_area_id UUID REFERENCES public.mining_areas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'queued',
  current_step TEXT DEFAULT 'data_intake',
  progress INTEGER DEFAULT 0,
  steps_completed JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mining_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_boundaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Mining areas policies
CREATE POLICY "Users can view own mining areas" ON public.mining_areas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create mining areas" ON public.mining_areas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mining areas" ON public.mining_areas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mining areas" ON public.mining_areas FOR DELETE USING (auth.uid() = user_id);

-- Approved boundaries policies (users can view/manage boundaries for their mining areas)
CREATE POLICY "Users can view boundaries for own areas" ON public.approved_boundaries FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.mining_areas WHERE id = mining_area_id AND user_id = auth.uid()));
CREATE POLICY "Users can create boundaries for own areas" ON public.approved_boundaries FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.mining_areas WHERE id = mining_area_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete boundaries for own areas" ON public.approved_boundaries FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.mining_areas WHERE id = mining_area_id AND user_id = auth.uid()));

-- Detection results policies
CREATE POLICY "Users can view results for own areas" ON public.detection_results FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.mining_areas WHERE id = mining_area_id AND user_id = auth.uid()));
CREATE POLICY "Users can create results for own areas" ON public.detection_results FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.mining_areas WHERE id = mining_area_id AND user_id = auth.uid()));

-- Alerts policies
CREATE POLICY "Users can view own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Processing jobs policies
CREATE POLICY "Users can view own jobs" ON public.processing_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own jobs" ON public.processing_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.processing_jobs FOR UPDATE USING (auth.uid() = user_id);

-- Create function for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mining_areas_updated_at BEFORE UPDATE ON public.mining_areas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();