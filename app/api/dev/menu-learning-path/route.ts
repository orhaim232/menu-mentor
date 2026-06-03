import { NextResponse } from 'next/server';
import { generateFallbackMenuLearningPathV2 } from '../../../../lib/ai/menuLearningPath';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Security check: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden in production' }, { status: 403 });
  }

  try {
    const learningPath = generateFallbackMenuLearningPathV2();

    return NextResponse.json({
      success: true,
      message: 'V2 menu learning path generated successfully using fallback data.',
      data: learningPath,
    });
  } catch (error) {
    console.error('Error in dev menu-learning-path route:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate V2 menu learning path' },
      { status: 500 }
    );
  }
}
